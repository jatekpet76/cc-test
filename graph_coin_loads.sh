#!/bin/bash

. ./setenv.sh

ls -1 "$GRAPH_DIR" | grep js | sed 's/\.js//g' | while read a; do
	file "$GRAPH_DIR/$a.csv";
	"$APP_DIR/graph_coin_load.sh" "$GRAPH_DIR/$a.csv"
done
