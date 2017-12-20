
// 1. https://coinmarketcap.com/exchanges/bitfinex/
// https://coinmarketcap.com/exchanges/binance/
// Browser script - for js

var ids = [];

$("td a").each(function (pos, el) { var href = $(el).attr("href"); if (href.indexOf("/currencies/") == 0) {ids.push(href.replace(/\/currencies\//, ""));} });

for (var i in ids) {console.log(ids[i])}

JSON.stringify(ids);
