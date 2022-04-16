
import '../../abstracts/typedef.js';

import BaseModel from "../base-model.js";

/**
 * The base class that all posts models classes should extend.
 * 
 * The template methods should be overriden
 * 
 * @class 
 */
export default class BasePosts extends BaseModel{

    /**
     * Returns all posts a user has liked.
     * 
     * @param {number} userId The id of user whose likes should be used to fetched the posts
     * @param {number} offset A number of posts to skip
     * @param {number} count The number of posts to return
     * @param {string} postIdOrder can be 'asc' or 'desc'
     * @returns {Post[]} A promise that resolves to all posts the user has liked
     */
    async getLikedPosts( userId , offset , count , postIdOrder ){
        return [];
    }

    /**
     * @param {number} userId The id of user whose posts should be returned
     * @param {number} offset A number of posts to skip
     * @param {number} count The number of posts to return
     * @param {string} postIdOrder can be 'asc' or 'desc'
     * @returns {Post[]} A promise that resolves to all posts a user created
     */
    async getOwnPosts( userId , offset , count , postIdOrder ){
        return [];
    }
}
