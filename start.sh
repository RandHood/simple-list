#!/bin/bash

cd cors-anywhere
npm install
cd ..
npm install

(trap 'kill 0' SIGINT; node ./cors-anywhere/server.js & npm start)