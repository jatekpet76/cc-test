
var depo = require('./test_simple_deposit.js');

// Sell if the rate is good of the coin price of the deposits
function TryToSell(ctx, currentDate, dayPos) {
	var removes = [];

	ctx.deposit.forEach((dep) => {
		if (dep.coin == null) {
			console.dir(ctx.deposit);
		}
		
		var rec = ctx.rec(ctx, dep.coin);
		
		if (rec) {
			dep.vol_usd = dep.piece*rec.price_usd;
			dep.vol_btc = dep.piece*rec.price_btc;
			
			if (dep.price_usd*ctx.buyRate < rec.price_usd) {
				console.log(
					currentDate,
					dep.coin,
					dep.price_usd*ctx.buyRate < rec.price_usd, 
					rec.price_usd / (dep.price_usd / 100), 
					dep.price_usd, 
					rec.price_usd);
				
				removes.push({dep, rec});
			}
		}
	});
	
	removes.forEach((el) => depo.remove(ctx, el.dep, el.rec));
	
	if (ctx.money > ctx.walletLimit && (dayPos > ctx.walletPeriod && dayPos % ctx.walletPeriod == 0)) {
		ctx.money -= ctx.walletLimit;
		ctx.wallet += ctx.walletLimit;
	}
}

module.exports.tryTo = TryToSell;
