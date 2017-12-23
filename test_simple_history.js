
function Init(ctx, currentDate, dayPos, limit) {
	ctx.history = {limit: limit, data: {}};
	
	SaveData(ctx, currentDate, dayPos);
}

function SaveData(ctx, currentDate, dayPos) {
	if (dayPos == 0 || (dayPos % ctx.history.limit == 0)) {
		ctx.coins.forEach((coin) => {
			var rec = ctx.rec(ctx, coin);
			
			ctx.history.data[coin] = {
				price_usd: rec.price_usd,
				price_btc: rec.price_btc,
			}
		});
		
		ctx.history.last = currentDate;
		
		console.log("HISTORY UPDATED: ", currentDate);
	}
}

function GetByName(ctx, coin) {
	return ctx.history.data[coin];
}

module.exports.get = GetByName;
module.exports.init = Init;
module.exports.save = SaveData;
