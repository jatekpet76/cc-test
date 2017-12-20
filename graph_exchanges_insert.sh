#!/bin/bash

. ./setenv.sh

# CREATE TABLE exchanges (name VARCHAR (30), coinid VARCHAR(30), PRIMARY KEY (name, coinid));
# SELECT name, COUNT(*) coins FROM exchanges GROUP BY name;

cat "$EXCHANGE_DIR/graph_exchanges_$1.txt" | sort | uniq | while read a; do 
	echo "INSERT INTO exchanges VALUES ('$1', '$a');" | $MYSQL_CMD; 
done
