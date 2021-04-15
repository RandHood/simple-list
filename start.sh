#!/bin/bash

cd cors-anywhere
npm install
cd ..
npm install

# node ./cors-anywhere/server.js & npm start && fg
(trap 'kill 0' SIGINT; node ./cors-anywhere/server.js & npm start)
