const mysql = require("mysql");
const private_ip = require("./isprivateip");

let host = '';
let user = '';
let password = '';
let database = '';

if (private_ip)
{
    host = 'localhost',
    user = 'root',
    password = '',
    database = 'phuketde_thsl'
}
else
{
    host = 'localhost',
    user = 'thsl',
    password = 'thsl_1212',
    database = 'phuketde_thsl'
}

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database
});

module.exports = pool;

// pool.getConnection(function(err, connection) {
// 	if (err) throw err; // not connected!
   
// 	// Use the connection
// 	connection.query('SELECT something FROM sometable', function (error, results, fields) {
// 	  // When done with the connection, release it.
// 	  connection.release();
   
// 	  // Handle error after the release.
// 	  if (error) throw error;
   
// 	  // Don't use the connection here, it has been returned to the pool.
// 	});
//   });