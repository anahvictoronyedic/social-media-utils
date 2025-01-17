
import '../../abstracts/typedef.js';

import ArrayUtils from "../../utils/array-utils.js";

/**
 * A Class that is used for mixing posts
 * @class
 */
export default class MixedPosts{

    /**
     * @var {BasePosts} An instance of a class derived from the BasePosts Model
     */
    postModel;

    /**
     * When added to a set of posts, can used as a post property by which the posts should be mixed
     * 
     * @var
     * @static
     */
    static MIX_KEY_PROP_KEY = 'mix_key';

    constructor( postsModel ){
        this.postsModel = postsModel;
    }

    /**
     * @param {Post[]} posts an array of posts 
     * @param {*} value a value used for mixing that will be added to the post object 
     * @returns {Post[]} An array of posts with each post having a mix property and its corresponding value
     */
    addMixKeyPropToAllPost( posts , value ){
        return posts.map( post => {
            post[MixedPosts.MIX_KEY_PROP_KEY] = value;
            return post;
        });
    }

    /**
     * Gets a number of both user own posts and posts a user has liked, combined in an alternating fashion.
     * 
     * @param {number} userId The id of the user whose post should be found
     * @param {number} cursor An offset point to start getting posts
     * @param {number} count The number of posts to return
     * @returns {Promise.<{posts:Post[],nextCursor:number}>} A promise that resolves to an object that contains the requested array of posts
     * and a nextCursor that will be used to fetch posts subsequently.
     */
    async getMixedFeedPosts( userId , cursor , count ){

        const offset = typeof cursor === 'number' ? cursor : 0;

        /**
         * Because the logic is to get the users own post and liked post separately and then mix them. This variable indicates if
         * an owner post should be the first item in the output array or else if liked post should be the first
         */
        const ownerPostsPrecedence = offset % 2 == 0;

        // the number of expected own post count to fetch
        const ownCount = ownerPostsPrecedence ? Math.ceil(count / 2) : Math.floor(count / 2);

        // the number of expected liked post count
        const likedCount = count - ownCount;

        // the offset for users own post
        const ownOffset = ownerPostsPrecedence ? offset / 2 : Math.ceil( offset / 2 );

        // offset for liked post
        const likedOffset = offset - ownOffset;

        // fetch the user own posts passing required parameters
        let ownPosts = await this.postsModel.getOwnPosts( userId , ownOffset , ownCount ,'desc');

        // fetch the user liked posts passing required parameters
        let likedPosts = await this.postsModel.getLikedPosts( userId , likedOffset , likedCount ,'desc');

        // the number of user own posts returned
        let ownPostsCount = ownPosts.length;

        // the number of liked posts returned
        let likedPostsCount = likedPosts.length;

        /**
         * If less than the expected number of own posts is fetched, then attempt to complete it with liked posts.
         */
        if( ownPostsCount < ownCount && likedPostsCount >= likedCount ){

            const additionalLikedCount = ownCount - ownPostsCount;

            // fetch the additional needed liked posts and push all into the array already fetched liked post
            likedPosts.push( ... await this.postsModel.getLikedPosts( userId , likedOffset + likedPostsCount , additionalLikedCount ,'desc'));

            // update the number of liked posts returned
            likedPostsCount = likedPosts.length;
        }
        /**
         * Else if less than the expected number of liked posts is fetched, attempt to complete it with own posts.
         */
        else if( likedPostsCount < likedCount && ownPostsCount >= ownCount ){

            const additionalOwnCount = likedCount - likedPostsCount;

            // fetch the additional needed user own posts and push all into the array already fetched user own post
            ownPosts.push( ... await this.postsModel.getOwnPosts( userId , ownOffset + ownPostsCount , additionalOwnCount ,'desc'));

            // update the number of user own posts returned
            ownPostsCount = ownPosts.length;
        }

        // add the mix property and its value to all posts, which will be used for mixing. 
        ownPosts = this.addMixKeyPropToAllPost( ownPosts , 1 );
        likedPosts = this.addMixKeyPropToAllPost( likedPosts , 2 );

        // mix the posts by the mix propertyName
        let mixedPosts = await this.mixBy( ownerPostsPrecedence ? ownPosts.concat( likedPosts ) : likedPosts.concat( ownPosts )  , 
        MixedPosts.MIX_KEY_PROP_KEY );

        // after mixing is completed, remove the mixed property from all posts
        mixedPosts = mixedPosts.map( post => {
            delete post[MixedPosts.MIX_KEY_PROP_KEY];
            return post;
        } );

        // compute the next offset
        let nextOffset = likedPostsCount + ownPostsCount < count ? null : offset + count ;

        const feedResult = {
            posts : mixedPosts,
            nextCursor : nextOffset,
        };

        return feedResult;
    }

    /**
     * Will mix an array of posts using each owner_id property. Runs in O(N) time.
     * 
     * @param {{id:number,owner_id:number}[]} sortedPosts an array of posts to be mixed
     * @returns {Promise.<Post[]>} A promise that resolves to an array of mixed posts 
     */
    async mixByOwners( sortedPosts ){
        // Runs in O(N) time.
        return this.mixBy( sortedPosts , 'owner_id' );
    }

    /**
     * Mixes an array of posts sorted by a property name passed to this function. Runs in O(N) time.
     * 
     * @param {*} sortedPosts an array of posts to be mixed
     * @param {*} propertyName The property of each post used for mixing
     * @returns {Promise.<Post[]>} A promise that resolves to an array of mixed posts 
     */
    async mixBy( sortedPosts , propertyName ){
        // Runs in O(N) time.
        return ArrayUtils.createSortedRepeat( sortedPosts , propertyName , false );
    }
}