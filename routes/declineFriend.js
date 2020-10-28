const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body.receiverId)}, {$pull: {pending_invitations: {$in: [req.body.senderId]}}})
    .then(response => res.status(200).json({status: 'success'}))
    .catch(error => console.error(error));
})

module.exports = router;
