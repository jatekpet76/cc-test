#!/bin/bash

. ./setenv.sh

cat "$HIST_DIR/historical_urls.txt" | while read a; do 
	echo "201$a"; 
	./historical_urls_load_table.sh "201$a";
done
