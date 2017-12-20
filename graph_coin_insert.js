var fs = require('fs');

var data = null;
var fileName = process.argv[2];
var coinId = process.argv[3];
var mode = process.argv[4];

/*
 INSERT INTO graph_day VALUES ('zrcoin', 1497643801000, '2017-06-16 20:10:01', 0, 0.030247, 75.5572, 4067)
  
 DROP TABLE graph_day;
 CREATE TABLE graph_day (coinid VARCHAR(30),  reglng BIGINT, regdate DATETIME, mcap_by_asup DECIMAL(26, 12), 
  price_btc DECIMAL(30, 20), price_usd DECIMAL(30, 20), volume_usd DECIMAL(26, 12), PRIMARY KEY (coinid, reglng));

godzzo@wow230:~/Dokumentumok/Projects/cc-test/grapdata$ ls -la *warns | grep -v 'godzzo    0 dec   20' | wc -l
62

 
*/

// console.log("FileName: ", fileName);
// console.log("coinId: ", coinId);

// __dirname + 
fs.readFile(fileName, function(err, parsed) {
	// console.dir(err);
	
	data = JSON.parse(parsed);
	
	ParseData();
});

function ParseData() {
	/*
	console.dir(data);
	
	for (var name in data) {
		console.log(name, data[name].length);
	}
	*/
	
	for (var i=0; i<data.price_usd.length; i++) {
		var rec = {
			coinid: coinId,
			reglng: data.price_usd[i][0],
			regdate: new Date(data.price_usd[i][0]).toISOString().substring(0, 19).replace(/T/, " "),
			mcap_by_asup: data.market_cap_by_available_supply[i][1],
			price_btc: data.price_btc[i][1],
			price_usd: data.price_usd[i][1],
			volume_usd: data.volume_usd[i][1]
		};
		
		if (mode == "sql") {
			console.log(`INSERT INTO graph_day VALUES ('${rec.coinid}', ${rec.reglng}, '${rec.regdate}', ${rec.mcap_by_asup}, ${rec.price_btc}, ${rec.price_usd}, ${rec.volume_usd})`);
		} else {
			console.log(`"${rec.coinid}";${rec.reglng};"${rec.regdate}";${rec.mcap_by_asup};${rec.price_btc};${rec.price_usd};${rec.volume_usd}`);
		}
	}
}
