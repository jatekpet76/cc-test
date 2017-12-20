#!/bin/bash

. ./setenv.sh

cat "$HIST_DIR/historical.html" | grep 'l/201' | sed  's|.*l/201||gi' | sed 's|/".*||gi' | sort | uniq > "$HIST_DIR/historical_urls.txt"

cat "$HIST_DIR/historical_urls.txt" | while read a; do echo "https://coinmarketcap.com/historical/201$a/";  wget -c "https://coinmarketcap.com/historical/201$a/" -O "h_201$a.html"; done
