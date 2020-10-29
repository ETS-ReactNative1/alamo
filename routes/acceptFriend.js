const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    console.log(req.body.senderId, 'would like to add ', req.body.receiverId, 'as a friend')

    //1. Remove recipent from senders sent_invitations and add to senders friends array
    //2. Remove sendersID from recipents pending_invitations and add to recipents friends array

    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.senderId)}, {$pull: {pending_invitations: req.body.receiverId}, $push: {friends: req.body.receiverId}})
    .then(response => {

        db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.receiverId)}, {$pull: {sent_invitations: req.body.senderId}, $push: {friends: req.body.senderId}})
        .then(response => res.status(200).json({status: 'success'}))

    })
    .catch(error => console.error(error));
})

module.exports = router;
