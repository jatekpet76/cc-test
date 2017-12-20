#!/bin/bash

. ./setenv.sh

cat "$HIST_DIR/historical_urls.txt" | while read a; do echo "https://coinmarketcap.com/historical/201$a/";  wget -c "https://coinmarketcap.com/historical/201$a/" -O "h_201$a.html"; done
