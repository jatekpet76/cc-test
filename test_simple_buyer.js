
var depo = require('./test_simple_deposit.js');
var hist = require('./test_simple_history.js');

// Make the initial investments, buy all coins with equally shared money (spend all money)
function BuyFirst(ctx) {
	var pieceMoney = ctx.money / ctx.coins.length;
	
	for (var name in ctx.data) {
		var rec = ctx.data[name][0];
		
		var piece = pieceMoney / rec.price_usd;
		
		depo.add(ctx, piece, rec);
	}
}

function TryToBuy(ctx, currentDate, dayPos) {
	if (ctx.money > 0) {
		ctx.coins.forEach((coin) => {
			var dep = depo.get(ctx, coin);
			var rec = ctx.rec(ctx, coin);
			var hrec = hist.get(ctx, coin);
			
			if (dep == null && dayPos != 0) { // Do not have this kind of deposit
				if (rec.price_usd != null && hrec.price_usd*ctx.sellRate > rec.price_usd) {
					var piece = (ctx.money < 50? ctx.money: ctx.money * 0.3) / rec.price_usd;
					
					console.log("BUY OK!", coin, hrec.price_usd*ctx.sellRate > rec.price_usd, hrec.price_usd, rec.price_usd);
					
					depo.add(ctx, piece, rec);
				} else {
					console.log("BUY FAILED", coin, hrec.price_usd*ctx.sellRate > rec.price_usd, hrec.price_usd, rec.price_usd);
				}
			} else {
				console.log("BUY HAVE SAME deposit", coin, dep);
			}
		});
	}
}

module.exports.first = BuyFirst;
module.exports.tryTo = TryToBuy;
