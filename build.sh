#!/usr/bin/env bash
echo 'Starting Alamo build.'
npm install --save
echo 'Starting ReactJS'
cd client && npm install --save && npm run build
chmod +x ./peerjs.sh
open -a Terminal.app peerjs.sh 
echo 'All Good. Enjoy!'
