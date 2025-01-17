import MixedPosts from "../models/posts/mixed-posts.js";
import Posts from "../mysql/models/posts.js";
import connection from "./connection.js";
import util from "util";
import assert from "assert";
import Users from "../mysql/models/users.js";
import MYSQLModelHelper from "../mysql/mysql-constants.js";

/**
 * can be called to make sure tests data exists in the database
 * 
 * user with id = 1, is the primary user used for testing.
 * 
 * Other users are created, so that their posts are also created for the primary user to like their posts as indicated in the queries.
 * 
 * Hence the primary user has his own posts and his likes, which is needed for proper testing.
 * 
 * Based on the fake data inserted into the tables, the total mixed posts for the primary user should be arranged in this order:
 * 
 * 6 - own
 * 10 - like
 * 5 - own
 * 9 - like
 * 4 - own
 * 8 - like
 * 3 - own
 * 7 - like
 * 2 - own
 * 1 - own
 */
const insertTestData = async ()=>{

    const queryFunction = util.promisify( connection.query ).bind( connection );

    const usersDeleteQuery = `DELETE FROM ${MYSQLModelHelper.Tables.Users.TableName}`;
    const postsDeleteQuery = `DELETE FROM ${MYSQLModelHelper.Tables.Posts.TableName}`;
    const likesDeleteQuery = `DELETE FROM ${MYSQLModelHelper.Tables.Likes.TableName}`;

    await queryFunction(likesDeleteQuery);
    await queryFunction(postsDeleteQuery);
    await queryFunction(usersDeleteQuery);
    
    const usersInsertQuery = `
    INSERT INTO ${ MYSQLModelHelper.Tables.Users.TableName }( id , username , email , full_name , profile_picture , bio , created_at )
    VALUES( 1,'johnkennedy' , 'johnkennedy@gmail.com' , 'John Kennedy' , 
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg', 'A nice Guy' ,
    ${Date.now()} ),
    ( 2,'paulwasher' , 'paulwasher@gmail.com' , 'Paul Washer' , 
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg', 'A nice Guy' ,
    ${Date.now()} ),
    ( 3,'ronaldkey' , 'ronaldkey@gmail.com' , 'Ronald Key' , 
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg', 'A nice Guy' ,
    ${Date.now()} )`;

    const postsInsertQuery = `
    INSERT INTO ${ MYSQLModelHelper.Tables.Posts.TableName }( id , user_id , description , image , created_at )
    VALUES( 1,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 2,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 3,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 4,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 5,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 6,1 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 7,2 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 8,2 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 9,3 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} ),
    ( 10,3 , 'something' , 'https://ichef.bbci.co.uk/news/976/cpsprodpb/6693/production/_111995262_gettyimages-1139930327.jpg',
    ${Date.now()} )`;
    
    const likesInsertQuery = `
    INSERT INTO ${ MYSQLModelHelper.Tables.Likes.TableName }( id , post_id , user_id , created_at )
    VALUES( 1 , 7 , 1 ,${Date.now()} ),
    ( 2 , 8 , 1 ,${Date.now()} ),
    ( 3 , 9 , 1 ,${Date.now()} ),
    ( 4 , 10 , 1 ,${Date.now()} )`;

    await queryFunction(usersInsertQuery);
    await queryFunction(postsInsertQuery);
    await queryFunction(likesInsertQuery);
};

describe(' MixedPosts Model ',()=>{

    /**
     * @var {MixedPosts}
     */
    let mixedPosts;

    before(async ()=>{

        await insertTestData();

        // create a user model instance
        const mysqlUserModel = new Users();
        mysqlUserModel.init({
            mysqlConnection:connection,
        });

        // create a post model instance
        const mysqlPostModel = new Posts();
        mysqlPostModel.init({
            mysqlConnection:connection,
            userModel:mysqlUserModel
        });

        // create the object for mixing posts
        mixedPosts = new MixedPosts( mysqlPostModel );
    });

    describe('mixByOwners()',()=>{
        
        it('should mix a series of posts from various owners turn by turn',async ()=>{

            const inputPosts = [
                {
                    id:1,
                    owner_id:2,
                },
                {
                    id:2,
                    owner_id:2,
                },
                {
                    id:3,
                    owner_id:2,
                },
                {
                    id:5,
                    owner_id:3,
                },
                {
                    id:7,
                    owner_id:3,
                },
                {
                    id:4,
                    owner_id:4,
                },
            ];

            const outputPosts = await mixedPosts.mixByOwners( inputPosts );

            assert.notEqual( outputPosts , false );
            assert.equal( outputPosts.length , 6 );
            assert.equal( outputPosts[0].id , 1 );
            assert.equal( outputPosts[1].id , 5 );
            assert.equal( outputPosts[2].id , 4 );
            assert.equal( outputPosts[3].id , 2 );
            assert.equal( outputPosts[4].id , 7 );
            assert.equal( outputPosts[5].id , 3 );
        });
    });

    describe('getMixedFeedPosts()',()=>{

        it('should mix a series of completely found posts properly',async ()=>{

            let feedResult , posts;
            
            feedResult = await mixedPosts.getMixedFeedPosts( 1 , null , 5 );
            posts = feedResult.posts;

            assert.notEqual( posts , false );
            assert.equal( posts.length , 5 );

            // check the order
            assert.equal( posts[0].id , 6 );
            assert.equal( posts[1].id , 10 );
            assert.equal( posts[2].id , 5 );
            assert.equal( posts[3].id , 9 );
            assert.equal( posts[4].id , 4 );

            assert.equal( feedResult.nextCursor , 5 );
        });
        
        it('should start with a liked post when the cursor is an odd number',async ()=>{

            let feedResult , posts;

            // odd number
            const nextCursor = 3;

            feedResult = await mixedPosts.getMixedFeedPosts( 1 , nextCursor , 2 );
            posts = feedResult.posts;
            assert.notEqual( posts , false );
            assert.equal( posts.length , 2 );

            // check if starts with an odd number
            assert.equal( posts[0].id , 9 );
        });
        
        it('should use available own posts for liked posts when fewer liked posts exists',async ()=>{

            let feedResult , posts;
            
            feedResult = await mixedPosts.getMixedFeedPosts( 1 , 7 , 5 );
            posts = feedResult.posts;
            assert.notEqual( posts , false );
            assert.equal( posts.length , 3 );
            assert.equal( posts[0].id , 7 );

            // Check if the remaining is own posts, seeing no other liked post can be found
            assert.equal( posts[1].id , 2 );
            assert.equal( posts[2].id , 1 );
        });

        it('should return nextCursor with value null when the number of available posts is not up to the required count',async ()=>{

            let feedResult;
            
            feedResult = await mixedPosts.getMixedFeedPosts( 1 , 5 , 
                // Give a large count that cannot be met
                200
            );

            // Since the count cannot be met, then nextCursor should be null
            assert.equal( feedResult.nextCursor , null );
        });
    });
});
