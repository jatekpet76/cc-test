#!/bin/bash

echo "Collect same warnings"
cat *warns | sed 's/.*Incorrect//g' | sed 's/at row.*//g' | grep -v Level | sort | uniq
