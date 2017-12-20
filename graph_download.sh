#!/bin/bash

. ./setenv.sh

# wget "https://coinmarketcap.com/currencies/bitcentavo"

cat $1 | while read a; do
	if test -f "$GRAPH_DIR$a.js"; then 
		echo "FOUND >>> $a <<< "
	fi
	if ! test -f "$GRAPH_DIR$a.js"; then 
		sleep 1;
		wget -c "https://graphs.coinmarketcap.com/currencies/$a/" -O "$OUT_DIR/$a.js";
	fi
done
