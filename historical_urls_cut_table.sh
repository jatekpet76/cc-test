#!/bin/bash

cat "$1" | grep -A 10000000 currencies-all | grep -B 1000000 /table > "table_$1";
