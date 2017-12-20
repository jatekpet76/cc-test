#!/bin/bash

. ./setenv.sh

# CREATE TABLE exchanges (name VARCHAR (30), coinid VARCHAR(30), rank INT, PRIMARY KEY (name, coinid));
# SELECT name, COUNT(*) coins FROM exchanges GROUP BY name;

declare -i num;
num=0

cat "$EXCHANGE_DIR/graph_exchanges_$1.txt" | sort | uniq | while read a; do 
	num=$num+1
	echo "INSERT INTO exchanges VALUES ('$1', '$a', $num);" | $MYSQL_CMD; 
done
