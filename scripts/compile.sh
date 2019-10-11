#!/bin/bash

cd ../pushEvent/src/v1

echo "==============================================="
echo "npm install"
echo "==============================================="
npm install

echo "==============================================="
echo "compile task"
echo "==============================================="
tsc

echo "==============================================="
echo "compile and run tests"
echo "==============================================="
cd tests
tsc
mocha _suite.js

# return to scripts directory
cd ../../..
echo "==============================================="
echo "Done."
