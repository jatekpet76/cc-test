
// Select coins by the given exchange
function InitExchange(ctx) {
	var sql = `
		SELECT * 
		FROM (
			SELECT coinid, MIN(regdate) mind, MAX(regdate) maxd 
			FROM graph_day 
			WHERE 
				coinid IN (SELECT coinid FROM exchanges WHERE name="${ctx.exchange}") 
			GROUP BY coinid
		) r 
		WHERE r.mind < '${ctx.minDate}'
	`;
	
	ctx.query(ctx, sql, SelectCoins);
}

// Grab coins daily stat for the selected coins (by ecxhange)
function SelectCoins(ctx, results) {
	
	ctx.coins = results.map((rec) => rec.coinid);
	var pCoins = results.map((rec) => rec.coinid);
	
	console.dir(ctx.coins);
	
	// InitCoinData("verge,cardano,ripple,neo,stellar".split(/,/), Calculate);
	
	InitCoinData(ctx, pCoins, ctx.main);
}

// Grab coin daily stat
function InitCoinData(ctx, coins, cb) {
	var coin = coins.shift();
	
	var sql = `
		SELECT d.dt, r.* FROM dates d LEFT OUTER JOIN (
			SELECT coinid, reglng, DATE(regdate) regdate, mcap_by_asup,
				price_btc, price_usd, volume_usd 
				FROM graph_day 
				WHERE coinid="${coin}" 
				AND DATE(regdate) BETWEEN "${ctx.coinFrom}" AND "${ctx.coinTo}" 
				ORDER BY 3
			) r ON d.dt = r.regdate
		WHERE d.dt BETWEEN "${ctx.coinFrom}" AND "${ctx.coinTo}"
	`;
	
	ctx.query(ctx, sql, function (ctx, results) {
		console.log("Get coin days: "+coin);
//		console.dir(results);
		
		ctx.data[coin] = results;
		
		if (coins.length > 0) {
			InitCoinData(ctx, coins, cb);
		} else {
			cb(ctx);
		}
	});
}

function StartInit(ctx) {
	InitExchange(ctx);
}

module.exports.start = StartInit;
