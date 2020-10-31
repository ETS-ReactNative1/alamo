const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv/config');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

//Require Routes
const user = require('./routes/user');
const userId = require('./routes/userId');
const completeProfile = require('./routes/completeProfile');
const searchUser = require('./routes/searchUser');
const createRoom = require('./routes/createRoom');
const roomInfo = require('./routes/roomInfo');
const addRoomToUser = require('./routes/addRoomToUser');
const addFriend = require('./routes/addFriend');
const declineFriend = require('./routes/declineFriend');
const pendingFriends = require('./routes/pendingFriends');
const checkFriendStatus = require('./routes/checkFriendStatus');
const acceptFriend = require('./routes/acceptFriend');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const clients = {}
const rooms = {}

io.on('connection', (socket) => {

    //Add user to list of connected clients and broadcast that user is online
    socket.on('online', (userId) => {
        if (!(userId in clients)) {
            clients[userId] = {socketId: socket.id}
            console.log(clients, 'CLIENTS CONNECTED')
            socket.broadcast.emit('new-user-online', userId);
        } else {
            //Update socket id but do not broadcast new user online
            clients[userId] = {socketId: socket.id }
            console.log(clients, 'CLIENTS CONNECTED')
        }
    })

    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId)

        //Join new room
        socket.join(roomId)

        //If room is newly created or empty, add first peer
        if (typeof rooms[roomId] == 'undefined') {
            rooms[roomId] = [userId]
        } else {
            //If room is already populated with a peer(s), append new peer to room
            let updateRoomPeers;
            updateRoomPeers = rooms[roomId].concat(userId);
            rooms[roomId] = updateRoomPeers;
        }

        //Output current users connected to room
        console.log(rooms[roomId])

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

            console.log(rooms[roomId])
            //Send updated peers list minus disconnected user
            socket.to(roomId).broadcast.emit('user-disconnected', userId, rooms[roomId])
        })
    })


    socket.on('add-friend', (senderId, receiverId) => {
        console.log(senderId, 'would like to add', receiverId, 'as a friend')
        socket.broadcast.emit('pending-invitation', senderId, receiverId);
    })

    socket.on('friend-event', (type, senderId, receiverId) => {
        if (type === 'decline') {
            socket.broadcast.emit('decline-friend-invite', receiverId);
        }

        if (type === 'accept') {
            socket.broadcast.emit('accept-friend-invite', senderId, receiverId)
        }
        
    })

})

io.on('disconnect', (socket) => {
    console.log('user disconnect', socket.id)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next){
    app.locals.io = io;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes
app.use('/user', user);
app.use('/userId', userId);
app.use('/complete-profile', completeProfile);
app.use('/search-user', searchUser);
app.use('/create-room', createRoom);
app.use('/room-info', roomInfo);
app.use('/add-user-to-room', addRoomToUser);
app.use('/add-friend', addFriend);
app.use('/decline-friend-invite', declineFriend);
app.use('/pending-friends', pendingFriends)
app.use('/check-friend-status', checkFriendStatus);
app.use('/accept-friend', acceptFriend);

//MongoDB Connection
const url = process.env.MONGO_DB_URL

MongoClient.connect(url, { useUnifiedTopology: true })
.then(client =>{
  const db = client.db('alamo-db');
  app.locals.db = db;
});

const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://alamo-d19124355.herokuapp.com/']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

// Serve any static files
app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
