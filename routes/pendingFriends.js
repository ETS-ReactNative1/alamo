const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.get('/', (req, res) => {
    const db = req.app.locals.db;

    console.log(req.query.userId, 'GET PENDING FRIENDS')
    
    const pendingFriends = {}

    db.collection('users').find(ObjectId(req.query.userId)).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
})

module.exports = router;
