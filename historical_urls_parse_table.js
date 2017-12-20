var fs = require('fs');
const cheerio = require('cheerio');

const cols = "rank name symbol marketcap price supply vol24h change1h change24h change7d".split(/ /g);
const defs = "histdate rank name symbol marketcap price supply vol24h change1h change24h change7d mineable altname id".split(/ /g);

/*
histdate	rank	name	symbol	marketcap	price	supply	vol24h	change1h	change24h	change7d	mineable

0.00000000000000000000

DROP TABLE mcaphist;
CREATE TABLE mcaphist (histdate DATE, rank INT, name VARCHAR(120), symbol VARCHAR(50), 
marketcap DECIMAL(26, 12), price DECIMAL(26, 12),  supply DECIMAL(26, 12), vol24h DECIMAL(26, 12), 
change1h DECIMAL(12, 4), change24h DECIMAL(12, 4), change7d DECIMAL(12, 4), mineable SMALLINT, altname VARCHAR(50), id VARCHAR(50),
PRIMARY KEY(histdate, id));

LOAD DATA LOCAL INFILE 'table_h_20171217.html.csv' INTO TABLE mcaphist FIELDS TERMINATED BY ';';

SHOW WARNINGS;

nodejs ./historical_urls_parse_table.js "/tables/table_h_20170730.html" "2017-07-30"


*/

var data = null;
var $ = null;
var fileName = process.argv[2];
var histDate = process.argv[3];

console.log("FileName: ", fileName);
console.log("DirName: ", __dirname);
console.log("histDate: ", histDate);

// __dirname + 
fs.readFile(fileName, function(err, parsed) {
	console.dir(err);
	
	data = parsed;
	$ = cheerio.load(data);
	
	ParseTable();
});

function ParseTable() {
	var records = [];
	var lines = [];
		
	$("table tr").each(function (pos, el) {
		var record = ParseTableRow($(el), pos);
		
		// console.dir(record);
		record["histdate"] = {text: histDate, data: histDate};
		
		records.push(record);
		
		var line = MakeLine(pos, record);
		
		if (line != null) {
			lines.push(line);
		}
	});
	
	WriteFile('.js', JSON.stringify(records));
	WriteFile('.csv', lines.join("\n"));
}

function MakeLine(pos, record) {
	var line = [];
	
	for (var i in defs) {
		var name = defs[i];
		
		// console.dir(record);
		// console.log(name);
		
		if (record[name]) {
			var dataVal = record[name].data;
			
			// console.log(dataVal);
			
			if (dataVal == null) {
				dataVal = "\\N";
			}
			
			line.push(dataVal);
		} else {
			console.log(pos+".", "COL NOT FOUND", name);
			
			return null;
		}
	}
	
	return line.join(";");
}

function WriteFile(extension, data) {
	fs.writeFile(fileName + extension, data, function () {});
}

function ParseTableRow(tr, trpos) {
	var rec = {};
	
	if (tr.attr("id")) {
		rec.id = {text: tr.attr("id"), data: tr.attr("id")};
	}
	
	$("td", tr).each(function (pos, el) {
		
		if ($("img", el).length > 0) {
			var altname = $("img", el).attr("alt");
			rec.altname = {text: altname, data: altname};
		}
		
		var colName = cols[pos];
		var text = $(el).text().replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/ /g, "");
		
		var dataVal = text.replace(/\$/g, "").replace(/,/g, "").replace(/%/g, "");
		
		// console.log(trpos + "/" + colName + ":", "["+text+"],", dataVal);
		
		rec[colName] = {text: text, data: dataVal};
	});
	
	FormatRecord(rec);
	
	return rec;
}

/*
Warning 1366    Incorrect decimal value: '>9999' for column 'change7d' at row 911

 decimal value: '>9999' for column 'change24h' 
 decimal value: '>9999' for column 'change7d' 
 decimal value: '?' for column 'change1h' 
Note	1265	Data truncated for column 'price' 
Warning	1265	Data truncated for column 'symbol' 

*/

function FormatRecord(record) {
	if (record.rank != undefined) { 
		if (record.supply.data.indexOf("*") > -1) {
			record.supply.data = record.supply.data.replace(/\*/g, "");
			record.mineable = {text: "false", data: 0};
		} else {
			record.mineable = {text: "true", data: 1};
		}

		ParseNum(record.change1h);
		ParseNum(record.change24h);
		ParseNum(record.change7d);
		ParseNum(record.vol24h);
		ParseNum(record.marketcap);
		ParseNum(record.supply);
	}
}

function ParseNum(fld) {
	if (fld.data == ">9999") {
		fld.data = "9999";
	}
	
	if (fld.data == "?") {
		fld.data = null;
	}
	
	if (fld.data == "LowVol") {
		fld.data = null;
	}
}
