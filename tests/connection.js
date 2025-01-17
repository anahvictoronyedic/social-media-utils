
import mysql from "mysql";

const connection = mysql.createConnection( {
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    /**
     * @WARNING This is database will be regarded as a test database, hence data can be deleted by the test system at anytime
     */
    database:'scropapp-test-db',
} );

export default connection;
