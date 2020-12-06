#!/usr/bin/env bash
echo 'Starting Alamo build.'
npm install
chmod +x ./nodejs.sh
open -b com.apple.terminal ./nodejs.sh
chmod +x ./peerjs.sh
open -b com.apple.terminal ./peerjs.sh
echo 'Starting ReactJS'
cd client
npm install
npm run dev
echo 'All Good. Enjoy!'
