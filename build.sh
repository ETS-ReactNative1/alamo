#!/usr/bin/env bash
echo 'Starting Alamo build.'
npm install --save
chmod +x ./nodejs.sh
open -a Terminal.app nodejs.sh 
chmod +x ./peerjs.sh
open -a Terminal.app peerjs.sh 
echo 'Starting ReactJS'
cd client && npm install --save && npm run build
npm install --save serve 
npm serve -s build
echo 'All Good. Enjoy!'
