const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', (req, res) => {
    if (req.query.email)
        searchQuery = {email: req.query.email}

    if (req.query.userId)
        searchQuery = ObjectId(req.query.userId)

    if (req.query.username)
        searchQuery = {username: req.query.username}

    User.find(searchQuery)
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
});

router.post('/add-room', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId

    User.updateOne({_id: userId}, {$push: {rooms: roomId}}, (err, object) => {
        console.log(object, 'updated')
        console.log(err)
    })
})

module.exports = router;
