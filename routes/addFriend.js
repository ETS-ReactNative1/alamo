const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    console.log(req.body.senderId, 'would like to add ', req.body.receiverId, 'as a friend')

    //Find recipent and add sender Id into pending invites array
    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.receiverId)}, {$push: {pending_invitations: req.body.senderId}})
    .then(response => {

        //Find sender and add reipent to sent invitations
        db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.senderId)}, {$push: {sent_invitations: req.body.receiverId}})
        .then(response => res.status(200).json({status: 'success'}))

    })
    .catch(error => console.error(error));
})

module.exports = router;
