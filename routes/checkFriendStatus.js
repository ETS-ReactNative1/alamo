const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', (req, res) => {
    const searcherId = req.query.searcherId;
    const recipentId = req.query.recipentId;

    console.log('check', searcherId, 'friend status with', recipentId)

    //Check if they are friends or not
    User.findOne({"_id": ObjectId(searcherId), friends: {$in: [recipentId]}})
        .then(response => {
            //If they are not friends
            if (response == null ) {

                //Check if the searcher has already sent a pending friends request 
                User.findOne({"_id": ObjectId(searcherId), sent_invitations: {$in: [recipentId]}})
                    .then(response => {
                        //If the search has not sent a friends request already
                        if (response == null) {

                            //Check whether the receipent has sent a friends requests to the searcher
                            User.findOne({"_id": ObjectId(recipentId), sent_invitations: {$in: [searcherId]}})
                            .then(response => {
                                //If the receiptent has not sent a friends request to the search
                                if (response == null) {

                                    //Then they are not friends and can add each other
                                    res.json({friendStatus: false})

                                } else {

                                    //If the receipent has already sent a friends request, then the search must accept or decline
                                    res.json({friendStatus: 'toBeAccepted'})

                                }
                            })
                            

                       } else {
                           //If the searcher has already sent a friends request to the recipent, then the invite is pending
                            res.json({friendStatus: 'pending'})
                       }
                    })

            } else {
                //If they are friends, return true
                res.json({friendStatus: true})
            }
        })
        .catch(err => console.log(err))
})

module.exports = router;
