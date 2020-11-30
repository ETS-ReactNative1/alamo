# Alamo
![Alamo](http://url/to/img.png)

## Introduction
Alamo is a real-time communications web application that combines the strengths of two very popular web applications currently available today, Discord and Twitch. Alamo provides gaming enthusiasts with a platform to share and experience their favourite online video games together - without missing a moment.  

## How it works
Alamo is a concept that places a massive ammount of emphasis on collaboration. Using Alamo Rooms, users simply create their room, put on their favourite Twitch streamer, invite their friends and hang out, talk and watch show together. 

## Installation

## UI Design

## Authentication
Alamos implements a session based authentication strategy and uses PassportJS middleware. The decision to go with PassportJS as a authentication library was easy, it provides excellent documentation and supports various login types that can be easily plugged in at a later date, allowing users to sign in using their Google, Facebook or Twitch credentials. However for now, alamo uses PassportJS's `local-strategy` as a 

### PassportJS

## Error Handling

## Third Party API's
Alamos Third Party API integration is 

### Twitch
Twitch provide a 

### Twitch Authentication


## File Uploading
File uploading is handled using [Cloudinary](https://cloudinary.com). As file uploading is not necessarily a key feature of alamo, besides allowing users to upload their own custom avatar image, outsourcing file handling to a cloud hosting service made sense. All uploads are performed on the clients side using Cloudinary's API and upon a successful upload, a url is then stored in the users metadata object. Cloudinary allows for custom presets to be configured, meaning all images uploaded are resized to a fixed width and height of `128x128px`. Similiarly, files uploaded are checked for appropriate file formats and a max file size of `5MB`, thanks to [react-image-upload](https://www.npmjs.com/package/react-images-uploading).


## Technical Design
Alamo is built upon the popular MERN stack - MongoDB, Express, React and Node.js. 

## Web RTC
Alamo's WebRTC is faciliated using [[PeerJS](https://peerjs.com/) and [socket.io](https://socket.io/). Both libraries provide fantastic documentation and stream line WebRTC signalling and peer-to-peer communications. 

## WebRTC Signalling
The first challenge to acheive WebRTC was to configure and implement a web signalling protocol. All WebRTC signalling is handled using socket.io's websocket library.

### Socket.io
Socket.io's server configuration is basic, straight forward and follows socket.io's documentation. No additional additional configuration options were used. Socket.io's client configuration take place at a high level in ReactJS's `App.js` file and passed down as a prop to React Components as required. This ensures that a client would only attempt to establish a WebSocket connection by triggering socket.io's `io.connect()` function once.

Upon the client successfully establishing a WebSocket connection, the clients user ID is passed to Node and stored in a `clients` object. `clients` helps keeps track of all connected client, along with their respective `socket.id` and current activity status. Due to the nature of socket.io, once a client refreshes the page, a new `socket.id` will be randomly generate. As a result, it is important to ensure that any new `socket.id` is updated on behalf of that user in Node's `clients` object.

        io.on('connection', (socket) => {
            socket.on('online', (userId, callback) => {
                //Add user to list of connected clients and broadcast that user is online
                if (!(userId in clients)) {
                    clients[userId] = {socketId: socket.id, status: ''}
                    io.sockets.emit('new-user-online', userId, clients);
                } else {
                    //Update socket id but do not broadcast new user online
                    clients[userId] = {socketId: socket.id }
                }
                //Emit updated connected clients to users 
                io.sockets.emit('new-user-online', userId, clients);

                //Send back list of active clients when user logs on
                callback(clients)
            })
        })

        
### Uniquely Identifying Rooms
On creation, a unique UUID (Universally Unique Identifier) is generated and stored in a MongoDB database. This UUID is the primary means of room identification and is used as a primary key of each room document. The decision to overwrite MongoDB native ObjectId was made to distungish between users and rooms. Each room Id would begin with `room` followed by a verison 4 UUID number. For example, `/room/0e446e3d-8dd2-4e0b-886b-5b5f3c8fb182`. Using a UUID library ensures all rooms generated have a unique primary key. 

Once a user has created a room and navigated to the room UUID URI, they essentially broadcast or emit that they would like to join a socket.io room. Socket.io rooms are no different than alamo rooms. They are a named space that sockets can join and leave. As a result, this allows for easy bi directional communication back and forth between each users in the room and between Alamo's Node server.

        this.props.socket.emit('join-room', this.props.activeRoom, localStorage.getItem('userId'))

Using Reacts ComponentDidMount lifecycle, a user emits to Node that they would like to join this room. 

### PeerJS
During development, a PeerJS server was running locally on a local machine. However, this was unsuitable once alamo was pushed to its own [Heroku](https://www.heroku.com) server. PeerJS would required a dedicated server to handle all alamos Peer-to-Peer WebRTC. Thankfully, Heroku makes this easy and provide a dedicated PeerJS button to quickly deloy a Peer server in only a few minutes. Configuration was straight forward, having only to update PeerJS host and port number on client-side.  

        this.peer = new Peer(localStorage.getItem('userId'), {
            host: 'https://alamo-peerjs.herokuapp.com',
            secure: true,
            host: 'alamo-peerjs.herokuapp.com',
            port: 443
        })
