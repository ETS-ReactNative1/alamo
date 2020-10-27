const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const roomId = req.body.roomId
    const userId = req.body.userId


    //Add room to user
    db.collection('users').find(ObjectId(userId)).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));

});

module.exports = router;
