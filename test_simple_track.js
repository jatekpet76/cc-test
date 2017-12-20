var mysql = require('mysql');

var conn = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PW,
	database: process.env.MYSQL_DB
});

/*
 * set @i = -1;
 * CREATE TABLE dates AS SELECT DATE(ADDDATE('2010-01-01', INTERVAL @i:=@i+1 DAY)) AS dt FROM graph_day HAVING  @i < DATEDIFF('2018-12-20', '2010-01-01');
 * 
 */

var exchange = process.argv[2];
var minDate = process.argv[3];
var coinFrom = process.argv[4];
var coinTo = process.argv[5];

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
	
	var sql = `
		SELECT d.dt, r.* FROM dates d LEFT OUTER JOIN (
			SELECT coinid, reglng, DATE(regdate) regdate, mcap_by_asup,
				price_btc, price_usd, volume_usd 
				FROM graph_day 
				WHERE coinid="${coin}" 
				AND DATE(regdate) BETWEEN "${coinFrom}" AND "${coinTo}" 
				ORDER BY 3
			) r ON d.dt = r.regdate
		WHERE d.dt BETWEEN "${coinFrom}" AND "${coinTo}"
	`;
	
	Query(sql, function (results) {
		console.log("Get coin days: "+coin);
//		console.dir(results);
		
		data[coin] = results;
		
		if (coins.length > 0) {
			InitCoinData(coins, cb);
		} else {
			cb();
		}
	});
}

function InitExchange(exchange, minDate) {
	var sql = `
		SELECT * 
		FROM (
			SELECT coinid, MIN(regdate) mind, MAX(regdate) maxd 
			FROM graph_day 
			WHERE 
				coinid IN (SELECT coinid FROM exchanges WHERE name="${exchange}") 
			GROUP BY coinid
		) r 
		WHERE r.mind < '${minDate}'
	`;
	
	Query(sql, SelectCoins);
}

function SelectCoins(results) {
	
	coins = results.map((rec) => rec.coinid);
	var pCoins = results.map((rec) => rec.coinid);
	
	console.dir(coins);
	
	// InitCoinData("verge,cardano,ripple,neo,stellar".split(/,/), Calculate);
	
	InitCoinData(pCoins, Calculate);
}

var coins = null;
var data = {};
conn.connect();

// Start
InitExchange(exchange, minDate);

function Calculate() {
	
	console.log("coins:", coins);
	var firstCoin = coins[0];
	
	console.log("firstCoin:", firstCoin);
	
	for (var name in data) {
		console.log(name, ":", data[name].length);
	}
	
	for (var i=0; i<data[firstCoin].length; i++) {
		var currentDate = data[firstCoin][i].regdate;
		
		console.log("currentDate:", currentDate);
	}
	
	Bye();
}	

function Bye() {
	conn.end();
	console.log("Bye");
}
