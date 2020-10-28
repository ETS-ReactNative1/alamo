const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    console.log(req.body.senderId, 'would like to add ', req.body.receiverId, 'as a friend')

    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.receiverId)}, {$push: {pending_invitations: req.body.senderId}})
    .then(response => res.status(200).json({status: 'sucess'}))
    .catch(error => console.error(error));
})

module.exports = router;
