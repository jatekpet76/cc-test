#!/bin/bash

. ./setenv.sh

cat "$EXCHANGE_DIR/graph_exchanges_$1.txt" | sort | uniq | while read a; do 
	if ! test -f "$GRAPH_DIR$a.js"; then 
		echo "not found $a"; 
	fi; 
done
