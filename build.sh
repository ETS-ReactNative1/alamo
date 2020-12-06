#!/usr/bin/env bash
echo 'Starting Alamo build.'
npm install --save
echo 'Starting PeerJS server'
peerjs --port 8081
echo 'Starting ReactJS'
cd client && npm install --save && npm run build
