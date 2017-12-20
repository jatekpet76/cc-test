var mysql = require('mysql');

var conn = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PW,
	database: process.env.MYSQL_DB
});


function Query(sql, cb) {
	conn.query(sql, function (error, results, fields) {
		console.log(sql);
		
		if (error) {
			throw error;
		}
		
		cb(results);
	});
}

function InitCoinData(coins, cb) {
	var coin = coins.shift();
	
	Query(`SELECT * FROM graph_day WHERE coinid="${coin}" ORDER BY 3`, function (results) {
		console.log("Get coin days: "+coin);
//		console.dir(results);
		
		data[coin] = results;
		
		if (coins.length > 0) {
			AddCoinData(coins, cb);
		} else {
			cb();
		}
	});
}

var data = {};
conn.connect();

InitCoinData("verge,cardano,ripple,neo,stellar".split(/,/), Calculate);

function Calculate() {
	
	for (var name in data) {
		console.log(name, data[name].length);
	}
}	

function Bye() {
	conn.end();
	console.log("Bye");
}

