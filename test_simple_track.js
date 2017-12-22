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

// UTIL 
function Query(sql, cb) {
	conn.query(sql, function (error, results, fields) {
		console.log(sql);
		
		if (error) {
			throw error;
		}
		
		cb(results);
	});
}

// Grab coin daily stat
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

// Select coins by the given exchange
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

// Grab coins daily stat for the selected coins (by ecxhange)
function SelectCoins(results) {
	
	coins = results.map((rec) => rec.coinid);
	var pCoins = results.map((rec) => rec.coinid);
	
	console.dir(coins);
	
	// InitCoinData("verge,cardano,ripple,neo,stellar".split(/,/), Calculate);
	
	InitCoinData(pCoins, Calculate);
}

var coins = null;
var deposit = [];
var data = {};
var money = 1000;
var buyRate = 1.17;
// var piece = 10;

conn.connect();

Start();

// Start
function Start() {
	InitExchange(exchange, minDate);
}

// Tha daily main loop, one peace is one step further
function Calculate() {
	
	console.log("coins:", coins);
	var firstCoin = coins[0];
	
	console.log("firstCoin:", firstCoin);
	
	for (var name in data) {
		console.log(name, ":", data[name].length);
	}
	
	BuyFirst();
	
	// Main loop for dates
	for (var i=0; i<data[firstCoin].length; i++) {
		var rec = data[firstCoin][i];
		var currentDate = rec.dt.toISOString().substring(0, 10);
		
		// .substring(0, 10);
		
		console.log("currentDate:", currentDate, typeof(currentDate));
		
		TryToSell(currentDate, i);
		
		// TryToBuy(currentDate, i); -- ???
	}
	
	Bye();
}	

// Sell if the rate is good of the coin price of the deposits
function TryToSell(currentDate, dayPos) {
	deposit.forEach((dep) => {
		var rec = data[dep.coin][dayPos];
		
		dep.vol_usd = dep.piece*rec.price_usd;
		dep.vol_btc = dep.piece*rec.price_btc;
		
		if (dep.price_usd*buyRate < rec.price_usd) {
			console.log(
				currentDate,
				dep.coin,
				dep.price_usd*buyRate < rec.price_usd, 
				rec.price_usd / (dep.price_usd / 100), 
				dep.price_usd, 
				rec.price_usd);
			
			DepositRemove(dep, rec);
		}
	});
}

// Sell one deposit completly
function DepositRemove(dep, rec) {
	console.log("Deposit Remove BEGIN >>> ", money, deposit.length);
	
	var moneyAdd = rec.price_usd * dep.piece;
	
	money += moneyAdd;
	
	var pos = DepositPosByName(dep.coin);
	
	deposit.splice(pos, 1);
	
	console.dir(dep);
	console.dir(rec);
	console.log("Deposit Remove END ", money, deposit.length);
}

function DepositPosByName(name) {
	var pos = null;
	
	deposit.forEach((val, idx) => {
		if (val.coin == name) {
			pos = idx;
		}
	});
	
	return pos;
}

// Make the initial investments, buy all coins with equally shared money (spend all money)
function BuyFirst() {
	var pieceMoney = money / coins.length;
	
	for (var name in data) {
		var rec = data[name][0];
		
		var piece = pieceMoney / rec.price_usd;
		
		DepositAdd(piece, rec);
	}
}

// Buy coin by the given piece
function DepositAdd(piece, rec) {
	money = money - (piece*rec.price_usd);
	
	var dep = {
		coin: rec.coinid,
		piece: piece, 
		price_usd: rec.price_usd,
		price_btc: rec.price_btc,
		vol_usd: piece*rec.price_usd,
		vol_btc: piece*rec.price_btc,
		buy_vol_usd: piece*rec.price_usd,
		buy_vol_btc: piece*rec.price_btc,
		regdate: rec.regdate
	};
	
	deposit.push(dep);
	
	console.log("Deposit Add BEGIN <<<");
	console.dir(dep);
	console.dir(rec);
	console.log("Deposit Add END <<<");
}

// Next time bro
function Bye() {
	console.log("Your money: ", money);
	
	var depositMoney = 0;
	deposit.forEach((el) => depositMoney += el.vol_usd);
	
	console.log("Your deposit value: ", depositMoney);
	console.log("Your full value: ", money+depositMoney);
	
	console.log("Your deposit: ", deposit);
	
	conn.end();
	console.log("Bye");
}
