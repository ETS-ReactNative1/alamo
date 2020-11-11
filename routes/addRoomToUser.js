const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId

    console.log(roomId, 'this is room id', userId, 'this is user id')

    const addNewToRoom = new User({

    })

    User.updateOne({_id: ObjectId(userId)}, {$push: {rooms: roomId}})
    .then(response => {
        console.log(response.data, 'this is find')
        res.status(200).json(response)
    })
    .catch(error => console.error(error));
});

module.exports = router;
