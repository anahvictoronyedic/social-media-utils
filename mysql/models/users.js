
import BasePosts from "../../models/posts/base-posts.js";
import util from "util";
import MYSQLModelHelper from "../mysql-constants.js";

/**
 * The User Model Class
 * @class
 */
export default class Users extends BasePosts{

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
    UsersTableInfo = MYSQLModelHelper.Tables.Users;

    constructor(){
        super( MYSQLModelHelper.Tables.Users.Fields );
    }

    async init( { mysqlConnection } ){
        this.mysqlConnection = mysqlConnection;
        this.queryFunction = util.promisify( this.mysqlConnection.query ).bind(this.mysqlConnection);
    }

    /**
     * 
     * @param {*} id The id of the user to find
     * @returns {User} the user object
     */
    async findById( id ){

        return this.queryFunction({
            sql:`SELECT * FROM ${this.UsersTableInfo.TableName} WHERE id = ?`,
            values:[id]
        }).then((result)=>{

            // if no user found return a promise that rejects
            if( result.length < 1 ) return Promise.reject();

            return this.hydrateData( result[0] );
        });
    }
}