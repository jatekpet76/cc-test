#!/bin/bash

. ./setenv.sh

# node "$APP_DIR/test_simple_track.js" "hitbtc" "2016-02-05" "2016-02-06" "2017-12-10";

# node "$APP_DIR/test_simple_track.js" "hitbtc" "2016-02-05" "2016-02-06" "2016-05-07";

# node "$APP_DIR/test_simple_track.js" "bitfinex" "2016-02-05" "2016-03-06" "2017-12-20";

node "$APP_DIR/test_simple_track.js" "hitbtc" "2016-02-05" "2016-03-06" "2017-12-20";

