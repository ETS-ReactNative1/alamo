#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo 'Starting Alamo build.'
npm install
chmod +x ./nodejs.sh
open -b com.apple.terminal $DIR/nodejs.sh
open -b com.apple.terminal $DIR/peerjs.sh
echo 'Starting ReactJS'
cd client
npm install
npm run dev
echo 'All Good. Enjoy!'
