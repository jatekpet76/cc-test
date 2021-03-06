
var db = require('./mysql_util.js');

var depo = require('./test_simple_deposit.js');
var init = require('./test_simple_init.js');
var buyer = require('./test_simple_buyer.js');
var seller = require('./test_simple_seller.js');
var hist = require('./test_simple_history.js');
var stat = require('./test_simple_stat.js');


/*
 * set @i = -1;
 * CREATE TABLE dates AS SELECT DATE(ADDDATE('2010-01-01', INTERVAL @i:=@i+1 DAY)) AS dt FROM graph_day HAVING  @i < DATEDIFF('2018-12-20', '2010-01-01');
 * 
 */

// var piece = 10;

var ctx = {
	coins: null,
	deposit: [],
	data: {},
	money: 1000,
	wallet: 0,
	
	buyRate: 1.15,
	sellRate: 0.90,
	historyLimit: 3,
	walletLimit: 200,
	walletPeriod: 28,
	
	exchange: process.argv[2],
	minDate: process.argv[3],
	coinFrom: process.argv[4],
	coinTo: process.argv[5],
	
	conn: db.open(),
	query: db.query,
	
	dayPos: null,
	currentDate: null,
	
	rec: (cx, coin) => {
		try {
			return cx.data[coin][ctx.dayPos]
		} catch (e) {
			console.log(coin, ctx.dayPos, ctx.currentDate, e);
			throw e;
		}
	}
}

Start(ctx);

// Start
function Start(ctx) {
	ctx.main = ScanDays;
	init.start(ctx);
}

// Tha daily main loop, one peace is one step further
function ScanDays(ctx) {
	
	console.log("coins:", ctx.coins);
	var firstCoin = ctx.coins[0];
	
	console.log("firstCoin:", firstCoin);
	
	for (var name in ctx.data) {
		console.log(name, ":", ctx.data[name].length);
	}
	
	buyer.first(ctx);
	
	// Main loop for dates
	for (var i=0; i<ctx.data[firstCoin].length; i++) {
		var rec = ctx.data[firstCoin][i];
		var currentDate = rec.dt.toISOString().substring(0, 10);
		
		ctx.dayPos =  i;
		ctx.currentDate =  currentDate;
		
		// .substring(0, 10);
		
		console.log("currentDate:", currentDate, typeof(currentDate));
		
		if (i == 0) {
			hist.init(ctx, currentDate, i, ctx.historyLimit);
		} else {
			hist.save(ctx, currentDate, i);
		}
		
		seller.tryTo(ctx, currentDate, i)
		buyer.tryTo(ctx, currentDate, i)
		
		// TryToBuy(currentDate, i); -- ???
	}
	
	stat.calc(ctx);
	
	Bye(ctx);
}	

// Next time bro
function Bye(ctx) {
	console.log("Your money: ", ctx.money);
	
	var depositMoney = 0;
	ctx.deposit.forEach((el) => depositMoney += el.vol_usd);
	
	console.log("Your deposit value: ", depositMoney);
	console.log("Your wallet value: ", ctx.wallet);
	console.log("Your full value: ", ctx.money+depositMoney+ctx.wallet);
	
	console.log("Your deposit: ", ctx.deposit);
	
	conn.end();
	console.log("Bye");
}

