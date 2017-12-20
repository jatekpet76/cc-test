#!/bin/bash

. ./setenv.sh

CSVFILE="$TABLE_DIR/table_h_$1.html.csv"

echo "LOAD DATA LOCAL INFILE '$CSVFILE' INTO TABLE mcaphist FIELDS TERMINATED BY ';';"
echo "LOAD DATA LOCAL INFILE '$CSVFILE' INTO TABLE mcaphist FIELDS TERMINATED BY ';'; SHOW WARNINGS;" |  $MYSQL_CMD > "$CSVFILE.warns"
