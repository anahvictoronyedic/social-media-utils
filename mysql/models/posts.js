
import BasePosts from "../../models/posts/base-posts.js";
import util from "util";
import Users from "./users.js";
import MYSQLModelHelper from "../mysql-constants.js";

/**
 * An implementation of the BasePosts model for mysql database storage
 * @class 
 */
export default class Posts extends BasePosts{

    /**
     * @member {Connection} The mysql connection to use
     */
    mysqlConnection = null;

    /**
     * @member {Function} A promisified version of the sql queryFunction package
     */
    queryFunction = null;

    /**
     * @private
     * @constant
     */
    PostsTableInfo = MYSQLModelHelper.Tables.Posts;

    /**
     * @private
     * @constant
     */
    LikesTableInfo = MYSQLModelHelper.Tables.Likes;

    constructor(){
        super( MYSQLModelHelper.Tables.Posts.Fields );
    }
 
    /**
     * 
     * @param {Object} config 
     * @param {Connection} config.mysqlConnection The mysql connection to use
     * @param {Users} A Users Model instance which this class will utilize
     */
    async init( { mysqlConnection , userModel } ){
        this.userModel = userModel;
        this.mysqlConnection = mysqlConnection;
        this.queryFunction = util.promisify( this.mysqlConnection.query ).bind(this.mysqlConnection);
    }

    /**
     * @override Check parent for params and return type documentation
     */
     async hydrateData( data ){
         
        const objects = await super.hydrateData( data );

        const isSingle = !Array.isArray(objects);
        
        if(isSingle) objects = [objects];

        // obj is a reference
        for( const obj of objects ){
            obj['owner'] = await this.userModel.findById(  obj['owner']);
        }

        return isSingle ? objects[0] : objects;
    }

    /**
     * @override Check super method for param and return documentation
     */
    async getLikedPosts( userId , offset , count , postIdOrder ){

        const likedPostQuery = `
        SELECT post_id FROM ${ this.LikesTableInfo.TableName }
        WHERE user_id = ?
        ORDER BY post_id ${postIdOrder}
        LIMIT ?
        OFFSET ?
        `;

        const likes = await this.queryFunction({
            sql:likedPostQuery,
            values:[ userId , count , offset ],
        });

        if( likes.length > 0 ){

            const postQuery = `
            SELECT * FROM ${ this.PostsTableInfo.TableName }
            WHERE id IN ( ${ Array( likes.length ).fill('?').join(', ') } )
            ORDER BY id ${postIdOrder}
            `;

            // fetch post for each like
            const posts = await this.queryFunction({
                sql:postQuery,
                values:likes.map( like => like['post_id'] ),
            });

            return this.hydrateData( posts );
        }
  
        return [];
    }

    /**
     * @override Check super method for param and return documentation
     */
    async getOwnPosts( userId , offset , count , postIdOrder ){

        const query = `
        SELECT * FROM ${ this.PostsTableInfo.TableName }
        WHERE user_id = ?
        ORDER BY id ${postIdOrder}
        LIMIT ?
        OFFSET ?
        `;

        const posts = await this.queryFunction({
            sql:query,
            values:[ userId , count , offset ],
        });

        return this.hydrateData( posts );
    }
}