
function Calc(ctx) {
	ctx.coins.forEach((coin) => {
		var sum = ctx.data[coin].reduce((p, n) => ({price_usd: p.price_usd + n.price_usd}));
		var min = ctx.data[coin].reduce((p, n) => ({price_usd: (p.price_usd > n.price_usd && n.price_usd != null)? n.price_usd: p.price_usd}));
		var max = ctx.data[coin].reduce((p, n) => ({price_usd: (p.price_usd > n.price_usd)? p.price_usd: n.price_usd}));
		
		console.log(coin, "min, max, avg", min.price_usd, max.price_usd, sum.price_usd/ctx.data[coin].length);
	});
}

module.exports.calc = Calc;
