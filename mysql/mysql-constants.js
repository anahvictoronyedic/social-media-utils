
/**
 * Holds constants for mysql dependent aspect of the application
 * @class
 */
export default class MYSQLModelHelper{
    
    /**
     * Holds model info and its corresponding table info( tablename, columnnames etc. ) to keep the code DRY application wide 
     * @static
     * @constant
     */
     static Tables = {
        Users:{
            TableName:'users',
            Fields:{
                id: {
                    DBFieldName:'id'
                },
                full_name: {
                    DBFieldName:'full_name'
                },
                username: {
                    DBFieldName:'username',
                },
                profile_picture: {
                    DBFieldName:'profile_picture'
                }
            },
        },
        Posts:{
            TableName:'posts',
            Fields:{
                id: {
                    DBFieldName:'id'
                },
                owner: {
                    DBFieldName:'user_id'
                },
                description: {
                    DBFieldName:'description',
                },
                image: {
                    DBFieldName:'image'
                },
                created_at: {
                    DBFieldName:'created_at'
                },
            },
        },
        Likes:{
            TableName:'likes',

            /**
             * @TODO Add Fields
             */
        },

        /**
         * @TODO Add Follow table
         */
    };
}
