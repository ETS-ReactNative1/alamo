const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/RoomSchema');
const ObjectId = require('mongoose').Types.ObjectId;

//Get room information
router.get('/', (req, res) => {
    const roomId = req.query.roomId;
    console.log(roomId)
    Room.findOne({roomId: roomId})
    .then(response => {
        console.log(response)
        res.status(200).json(response)
    })
    .catch(error => console.error(error));
})

//Create new room
router.post('/create-room', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId
    const roomTitle = req.body.roomTitle

    //Store new room in db
    Room.create({roomId: roomId, room_title: roomTitle, stream_channel: 'ESL_CSGO'})
    .then(response => {
        Room.updateOne({roomId: roomId}, {$push: {admins: userId}}, (err, object) => {
            if (!err)
                res.status(200).json({status: 'room successfully created'})
        })
    })
    .catch(error => console.error(error));
});

module.exports = router;
