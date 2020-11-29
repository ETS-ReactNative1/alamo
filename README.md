# Alamo
![Alamo](http://url/to/img.png)

## Introduction
Alamo is a real-time communications web application that combines the strengths of two very popular web applications currently available today, Discord and Twitch. Alamo provides gaming enthusiasts with a platform to share and experience their favourite online video games together - without missing a moment.  

## How it works
Alamo is a concept that places a massive ammount of emphasis on collaboration. Using Alamo Rooms, users simply create their room, put on their favourite Twitch streamer, invite their friends and hang out, talk and watch show together. 

## Technical Design
Alamo is built upon the popular MERN stack - MongoDB, Express, React and Node.js. 

## Web RTC
Alamo's WebRTC is faciliated using [[PeerJS](https://peerjs.com/) and [socket.io](https://socket.io/). Both libraries provide fantastic documentation and stream line WebRTC signalling and peer-to-peer communications. 

### WebRTC Signalling
The first challenge to acheive WebRTC was to configure and implement a web signalling protocol. Web signalling is the process of setting up peers so that they can actually hear each other. It is essentially like providing a clear path for two or more users to meet in the same room where they can have a conversation. 

All WebRTC signalling is handled using socket.io's websocket library. 
When a user creates a alamo room, a unique UUID (Universally Unique Identifier) is generated and stored in a MongoDB database. This UUID is the primary means of identifying a room and is used as a primary key of each room document. The decision to overwrite MongoDb ObjectId was made to distungish between users and rooms. Each room Id would begin with `room` followed by a verison 4 UUID number. For example, `/room/0e446e3d-8dd2-4e0b-886b-5b5f3c8fb182`. Using a UUID library gave me confidence to ensure all rooms generated would come with a unique primary key. 


