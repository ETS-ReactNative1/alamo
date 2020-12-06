#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo 'Starting Alamo build.'
chmod +x ./nodejs.sh
echo 'Starting Node'
open -b com.apple.terminal ./nodejs.sh
echo 'Starting PeerJS'
chmod +x ./peerjs.sh
open -b com.apple.terminal ./peerjs.sh
cd client
npm install --save
npm run dev
echo 'All Good. Enjoy!'
