
var mysql = require('mysql');

function Open() {
	conn = mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PW,
		database: process.env.MYSQL_DB
	});
	
	conn.connect();
	
	return conn;
}

// UTIL 
function Query(ctx, sql, cb) {
	ctx.conn.query(sql, function (error, results, fields) {
		console.log(sql);
		
		if (error) {
			throw error;
		}
		
		cb(ctx, results);
	});
}

module.exports.open = Open;
module.exports.query = Query;
