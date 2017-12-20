#!/bin/bash

. ./setenv.sh

echo "LOAD DATA LOCAL INFILE '$1' INTO TABLE graph_day FIELDS TERMINATED BY ';' ENCLOSED BY '\"' ;"
echo "LOAD DATA LOCAL INFILE '$1' INTO TABLE graph_day FIELDS TERMINATED BY ';' ENCLOSED BY '\"' ; SHOW WARNINGS;" |  $MYSQL_CMD > "$1.warns"
