#!/bin/bash

. ./setenv.sh

ls -1 "$HIST_DIR/h_*html" | while read a; do ./historical_urls_cut_table.sh "$a"; done
