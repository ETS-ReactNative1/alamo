# Alamo
![Alamo](https://i.imgur.com/rIhuag5.png "alamo rooms")

## Introduction
Alamo is a real-time communications web application that combines the strengths of two very popular web applications currently available today, Discord and Twitch. Alamo provides gaming enthusiasts with a platform to share and experience their favourite online video games together.  

Full repository available - [https://github.com/kangadrewie/alamo](https://github.com/kangadrewie/alamo)

## How it works
Alamo is a concept that places a massive amount of emphasis on collaboration. Using Alamo Rooms, users simply create their room, put on their favourite Twitch streamer, invite their friends and hang out, talk and watch show together. 

## Installation
To install alamo locally, simply run the following command in the alamo working directory.

    chmod +x build.sh; ./build.sh

In the event this fails, users can install using the following:

**Node / Express**
    
     npm install --save && npm start
     
**PeerJS** 

     npm install --save peerjs && peerjs --port 8081
     
**React**
    
     cd client && npm install --save && npm run dev
    
## Heroku
Alternatively, alamo can be viewed from its Heroku domain.

[https://alamo-d19124355.herokuapp.com](https://alamo-d19124355.herokuapp.com)

    
### Account Access
    
#### Email

    alamo-user-1@gmail.com
    
#### Password

    D19124355
    
## Technical Design
Alamo is built upon the popular MERN stack - MongoDB, Express, React and Node.js. 
    
## Authentication
Alamos implements a session based authentication strategy and uses PassportJS middleware. The decision to go with PassportJS as a authentication library was easy, it provides excellent documentation and supports various login types that can be easily plugged in at a later date, allowing users to sign in using their Google, Facebook or Twitch credentials. However for now, alamo uses PassportJS's `local-strategy` as a primary means of authentication. 

### PassportJS
[PassportJS](http://www.passportjs.org), along with `BCrypt` is used to handle all sensitive information. All passwords are hashed and salted using the `BCrypt` library before being stored in the database.

## Error Handling
Error Handling is handled using Reacts Error Boundary. This is simply set up to catch and major errors and report back to the user that something has gone wrong. Initially, the idea what to allow users to report issues to a dedicated mailbox. However, due to time constraints this was not completed in time. 

## Third Party API's
Alamos Third Party API integration consists primarily of [Twitch.tv](https://twitch.tv) public API. 

### Twitch
Unfortunately, Twitch's API is quite limited in what is can do. This limitation was unknown at the start of the project. For example, there is no relationship between Twitch.tv channels and streams. As a result, if a user wishes to query a channel, that channels stream cannot be identified. However, one potential work around may be to allow users to simply copy and paste a URL of a choosen stream. 

### Twitch Authentication
Twitch provides its access tokens with an expiration. As a result, authentication for Twitches API is set on a `setTimeout` and recursively calls itself to ensure alamo has a valid access token at all time.

        authTwitch = () => {
            axios.post(twitchUrl)
                .then((response) => {
                    let access_token = response.data.access_token;
                    app.locals.client_id = client_id;
                    app.locals.access_token = access_token;
                    setTimeout(() => {
                        authTwitch();    
                    }, (response.data.expires_in - 100))
                })
                .catch((err) => console.log(err))
        }

# User
## File Uploading
File uploading is handled using [Cloudinary](https://cloudinary.com). As file uploading is not necessarily a key feature of alamo, besides allowing users to upload their own custom avatar image, outsourcing file handling to a cloud hosting service made sense. All uploads are performed on the clients side using Cloudinary's API and upon a successful upload, a url is then stored in the users metadata object. Cloudinary allows for custom presets to be configured, meaning all images uploaded are resized to a fixed width and height of `128x128px`. Similiarly, files uploaded are checked for appropriate file formats and a max file size of `5MB`, thanks to [react-image-upload](https://www.npmjs.com/package/react-images-uploading).

## Password Reset
Password resets and forgotten passwords are handled using a token based system. In the event a user forget the accounts password, users can reset it. On reset request, a email is sent to the user along with a timestamped UUID V1 token. This token is store in the users document in MongoDB. When a user follows the url to reset password, the token is checked to see if valid. A token is only valid if it is the most recent token created and is less than an hour old. The new passport is checked to ensure its level of security is appropriate (must container uppercase letter & number), and then passed through `PassportJS`, where it is hashed, salted and updated in the database. All emails for password reset are handled using `Nodemailer`.

## Web RTC
Alamo's WebRTC is faciliated using [PeerJS](https://peerjs.com/) and [socket.io](https://socket.io/). Both libraries provide fantastic documentation and stream line WebRTC signalling and peer-to-peer communications. 

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

                //Send back list of active clients when user logs on
                callback(clients)
            })
        })

### Room System
Alamo rooms provide the necessary means of establishing a WebRTC connection between users. When a user enters an alamo room, that users emits to join a `socket.io` room also. Upon joining the `socket.io` room, other sockets in the rooms are notified and all parties are able to communicate freely. However, users in the room do not necessary now who else may be in there with them, only the server knows this information. As a result, the server keeps other users informed of the current state of the room.

        socket.on('join-room', (roomId, userId) => {

            //Join new room
            socket.join(roomId)

            //If room is newly created or empty, add first peer
            if (typeof rooms[roomId] == 'undefined') {
                rooms[roomId] = [userId]
            } else {
                //If room is already populated with a peer(s), append new peer to room
                //Prevent user being added to same room twice
                if (!(rooms[roomId].includes(userId, 0))) {
                    let updateRoomPeers;
                    updateRoomPeers = rooms[roomId].concat(userId);
                    rooms[roomId] = updateRoomPeers;
                }
            }

            //Broadcast to anyone that may have this room favourited that a user has joined and update room size
            socket.broadcast.emit('user-joined-room', roomId, rooms[roomId])

            //Need to send a direct message to the client of peers list, emit does not seem to work
            socket.emit('client-connected', userId, rooms[roomId]);

            //Broadcast to other users in room, that a new user has connected
            socket.to(roomId).broadcast.emit('user-connected', userId, rooms[roomId])

            socket.on('disconnect', () => {
                //On disconnect remove peer from list of connected peers
                let updateRoomPeers;
                updateRoomPeers = rooms[roomId];
                updateRoomPeers = updateRoomPeers.filter(item => item !== userId)
                rooms[roomId] = updateRoomPeers;

                //Send updated peers list minus disconnected user
                socket.to(roomId).broadcast.emit('user-disconnected', userId, rooms[roomId])
            })
        })
        
### Dynamically Create Audio Elements
One of the biggest challenges was dynamically creating audio elements for each user. User audio elements are created and managed using React.Refs. Upon joining a user requests a update list of current peers in a room. This is necessary to happen before any WebRTC takes places, as a audio element must be exist in order for a WebRTC connection. 
       
    //Request updated peers list before routing call
    this.props.socket.emit('request-peers', this.props.activeRoom, (peers) => {
        this.updatePeersInRoom(peers)
            .then(() => {
                this.playUserAudio(call.peer, userAudioStream)
            })
    })
    
The client then generates a list of audio elements with Refs linked to each peer or user in the room. This allows for audio elements to be created and removed based upon the current state of the room.

        updatePeersInRoom = async (peers) => {
            const updatePeers = new Promise((resolve, reject) => {
                //Create Ref of updatePeersList
                peers.forEach(thing => {
                    this[`${thing}_ref`] = React.createRef()
                });

                //Add the peers state
                this.setState({
                    peers: peers
                }, () => {
                    resolve()
                })
            })
            return updatePeers;
        }
        
        {this.state.peers.map((userId) => {
            return(
                <div data-userid={userId}>
                    <audio id={userId} key={'audio'+userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                </div>
            )
        })}
        
### Establishing PeerJS WebRTC
Once joined, a client then receive a PeerJS call from each user in the room, along with their audio stream. Thankfully, `PeerJS` allow for `peer.ids` to be defined, which allowed for users UUID to be used as a primary means of identifying and calling other users. 

            this.peer.on('call', call => {
                call.answer(stream);
                call.on('stream', userAudioStream => {
                    //Request updated peers list before routing call
                    this.props.socket.emit('request-peers', this.props.activeRoom, (peers) => {
                        this.updatePeersInRoom(peers)
                            .then(() => {
                                this.playUserAudio(call.peer, userAudioStream)
                            })
                    })
                })
            })

Upon receiving a call, a user answers by returning their own audio stream. At this point, both users have each other audio streams, all that is left to do is output the audio. This is were `React.Refs` come in handy. All the has to be done is reference the audio element that was created earlier, and apply the new ObjectSRC with callers stream.

        playUserAudio = (userId, stream) => {
            //If connected user is client, then we want to mute that audio ref element
            if (userId === clientId) {
                this[`${userId}_ref`].current.srcObject = stream;
                this[`${userId}_ref`].current.muted = true;
            } else {
                this[`${userId}_ref`].current.srcObject = stream;
            }
        }
        
### Uniquely Identifying Rooms
On creation, a unique UUID (Universally Unique Identifier) is generated and stored in a MongoDB database. This UUID is the primary means of room identification and is used as a primary key of each room document. The decision to overwrite MongoDB native ObjectId was made to distungish between users and rooms. Each room Id would begin with `room` followed by a version 4 UUID number. For example, `/room/0e446e3d-8dd2-4e0b-886b-5b5f3c8fb182`. Using a UUID library ensures all rooms generated have a unique primary key. 

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
