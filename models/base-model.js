/**
 * A base class which all models classes should extend
 * @class
 */
export default class BaseModel{

    /**
     * @private
     * 
     * @param {Object} fieldsInfo a key value mapping of model propertyName to its options
     * @property {string} fieldsInfo.DBFieldName the model field corresponding database field name. e.g. column in sql databases, fields in mongo etc.
     */
    fieldsInfo ;

    constructor( fieldsInfo ){
        this.fieldsInfo = fieldsInfo;
    }

    /**
     * 
     * @param {*} config A configuration for initializing the model
     */
    async init( config ){}
    
    /**
     * Will transform a data fetched from the database to its stable object form. which can be used in other parts of the application 
     * or outputed to a network client possibly via json.
     * 
     * Can be overriden, so that subclasses can control the hydration. e.g. subclasses may add data of other forms.
     * 
     * @param {*} data the data to hydrate
     * @returns An array of objects
     */
     async hydrateData( data ){

        const fieldsInfo = this.fieldsInfo;

        const isSingle = !Array.isArray(data);
        
        if(isSingle) data = [data];

        const objects = [];

        for( const datium of data ){

            // get all properties the hydrated object should contain
            const fieldKeys = Object.getOwnPropertyNames(fieldsInfo);

            const obj = {};
            for( const fieldKey of fieldKeys ){
                obj[fieldKey] = datium[ fieldsInfo[fieldKey].DBFieldName ];
            }

            objects.push( obj );
        }

        return isSingle ? objects[0] : objects;
    }
}