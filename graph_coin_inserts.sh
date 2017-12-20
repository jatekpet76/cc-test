#!/bin/bash

. ./setenv.sh

# node ./graph_coin_insert.js grapdata/adtoken.js adtoke

ls -1 "$GRAPH_DIR" | grep js | sed 's/\.js//g' | while read a; do
	file "$GRAPH_DIR/$a.js";
	node "$APP_DIR/graph_coin_insert.js" "$GRAPH_DIR/$a.js" "$a" "csv" > "$GRAPH_DIR/$a.csv"
done

# node "$APP_DIR/graph_coin_insert.js" "$GRAPH_DIR/$a.js" "$a" "sql" > "$GRAPH_DIR/$a.sql"
