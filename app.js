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


const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clients = {}

io.on('connection', (socket) => {
    socket.on('online', (userId) => {

        clients[userId] = {socketId: socket.id}

        console.log(clients, 'CLIENTS CONNECTED')

        console.log('User ' + userId + ' is now online', 'socketId', socket.id) 
        socket.broadcast.emit('new-user-online', userId);
    })

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
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
        
    })
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
