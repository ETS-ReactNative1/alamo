const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/RoomSchema');
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId
    const roomTitle = req.body.roomTitle

    //Store new room in db
    Room.create({roomId: roomId, room_title: roomTitle, stream_channel: 'ESL_CSGO'})
    .then(response => {
        Room.updateOne({roomId: roomId}, {$push: {admins: userId}})
            .then((response) => {
                res.status(200).json({status: 'success'})
            })
    })
    .catch(error => console.error(error));
});

module.exports = router;
