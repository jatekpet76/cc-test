#!/bin/bash

. ./setenv.sh

# ls -1 table_*html | while read a; do nodejs "$APP_DIR/historical_urls_parse_table.js" "$OUT_DIR/$a"; done

cat historical_urls.txt | while read a; do 
	dt=$(date --date="201$a" "+%Y-%m-%d"); 
	echo $dt; 
	file "$TABLE_DIR/table_h_201$a.html"; 
	nodejs ./historical_urls_parse_table.js "$TABLE_DIR/table_h_201$a.html" "$dt"; 
done
