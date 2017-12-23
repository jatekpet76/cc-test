
// Buy coin by the given piece
function DepositAdd(ctx, piece, rec) {
	ctx.money = ctx.money - (piece*rec.price_usd);
	
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
	
	ctx.deposit.push(dep);
	
	console.log("Deposit Add BEGIN <<<");
	console.dir(dep);
	console.dir(rec);
	console.log("Deposit Add END <<<");
}

// Sell one deposit completly
function DepositRemove(ctx, dep, rec) {
	console.log("Deposit Remove BEGIN >>> ", ctx.money, ctx.deposit.length);
	
	var moneyAdd = rec.price_usd * dep.piece;
	
	ctx.money += moneyAdd;
	
	var pos = DepositPosByName(ctx, dep.coin);
	
	ctx.deposit.splice(pos, 1);
	
	console.dir(dep);
	console.dir(rec);
	console.log("Deposit Remove END ", ctx.money, ctx.deposit.length);
}

function DepositPosByName(ctx, name) {
	return ctx.deposit.findIndex((val) => val.coin == name);
}

function DepositByName(ctx, name) {
	return ctx.deposit.find((val) => val.coin == name);
}


module.exports.remove = DepositRemove;
module.exports.get = DepositByName;
module.exports.byName = DepositPosByName;
module.exports.add = DepositAdd;
