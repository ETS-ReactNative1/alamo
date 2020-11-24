const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../models/userSchema') || mongoose.model('users');

router.get('/', (req, res) => {
    if (req.query.email)
        searchQuery = {email: req.query.email}

    if (req.query.userId)
        searchQuery = ObjectId(req.query.userId)

    if (req.query.username)
        searchQuery = {username: req.query.username}

    User.find(searchQuery)
    .then(response => {
        res.status(200).json(response)})
    .catch(error => console.error(error));
});

router.get('/search-friend', (req, res) => {

    //Find user to search array of friends
    User.findOne({username: req.query.username})
    .then(response => {
        User.findOne({_id: response._id, friends: {$in: [`${req.query.userId}`]}})
            .then(response => {
                res.status(200).json(response)
            })
    })
    .catch(error => console.error(error));
});


router.post('/complete-profile', (req, res) => {
    User.findOne({username: req.body.username.toLowerCase()})
        .then(response => {
            if (response == null) {
                User.updateOne({email: req.body.email}, {$set: {username: req.body.username.toLowerCase(), account_setup: true, user_metadata: {username: req.body.username, avatar: req.body.avatar}}})
                .then(response => res.status(200).json({status: 'sucess'}))
                .catch(error => console.error(error));
            } else {
                res.status(301).send('Username not available')
            }
        })
});


router.post('/add-room', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId

    User.updateOne({_id: userId}, {$push: {rooms: roomId}})
        .then((response) => {
            res.status(200).json({status: 'User added to room'})
        })
        .catch((err) => console.log(err))
})

router.post('/remove-room', (req, res) => {
    const roomId = req.body.roomId
    const userId = req.body.userId

    User.updateOne({_id: userId}, {$pull: {rooms: roomId}})
        .then((response) => {
            res.status(200).json({status: 'User removed from room'})
        })
        .catch((err) => console.log(err))
})



router.post('/add-friend', (req, res) => {
    console.log(req.body.senderId, 'would like to add ', req.body.receiverId, 'as a friend')

    //Find recipent and add sender Id into pending invites array
    User.updateOne({_id: ObjectId(req.body.receiverId)}, {$push: {pending_invitations: req.body.senderId}})
    .then(response => {

        //Find sender and add reipent to sent invitations
        User.updateOne({_id: ObjectId(req.body.senderId)}, {$push: {sent_invitations: req.body.receiverId}})
        .then(response => res.status(200).json({status: 'success'}))

    })
    .catch(error => console.error(error));
})

router.post('/decline-friend', (req, res) => {
    User.updateOne({_id: ObjectId(req.body.receiverId)}, {$pull: {pending_invitations: {$in: [req.body.senderId]}}})
    .then(response => {
        User.updateOne({_id: ObjectId(req.body.senderId)}, {$pull: {sent_invitations: {$in: [req.body.receiverId]}}})
    }).then(response => res.status(200).json({status: 'success'}))
    .catch(error => console.error(error));
})


router.post('/accept-friend', (req, res) => {
    console.log(req.body.senderId, 'would like to add ', req.body.receiverId, 'as a friend')

    //1. Remove recipent from senders sent_invitations and add to senders friends array
    //2. Remove sendersID from recipents pending_invitations and add to recipents friends array

    User.updateOne({_id: ObjectId(req.body.senderId)}, {$pull: {pending_invitations: req.body.receiverId}, $push: {friends: req.body.receiverId}})
    .then(response => {
        User.updateOne({_id: ObjectId(req.body.receiverId)}, {$pull: {sent_invitations: req.body.senderId}, $push: {friends: req.body.senderId}})
        .then(response => res.status(200).json({status: 'success'}))
    })
    .catch(error => console.error(error));
})

router.post('/unfriend', (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    
    User.updateOne({_id: userId}, {$pull : {friends : friendId}})
        .then((response) => {
            User.updateOne({_id: friendId}, {$pull : {friends : userId}})
                .then((response) => {
                    res.status(200).json({status: `${friendId} has been removed from friends`})
                })
        })
        .catch((err) => console.log(err))
});

router.post('/change-email', (req, res) => {
    const userId = req.body.userId;
    const newEmail = req.body.newEmail;

    User.findOne({email: newEmail})
        .then((response) => {
            if (response === null) {
                User.updateOne({_id: userId}, {email : newEmail})
                    .then((response) => {
                        res.status(200).json({status: 'Email has been successfully updated'})
                    })
                    .catch((err) => console.log(err))
            } else {
                 res.status(400).json({status: 'A user already exists with this email'})
            }   
        })
});


module.exports = router;
