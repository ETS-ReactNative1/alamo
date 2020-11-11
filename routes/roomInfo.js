const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/RoomSchema');

router.get('/', (req, res) => {
    const roomId = req.query.roomId;

    Room.findOne({roomId: roomId})
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => console.error(error));
})

module.exports= router;
