const express = require('express');
const router = express.Router();

const user = {
    name: 'miller'
}

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    db.collection('users').findOne({username: req.body.username.toLowerCase()})
        .then(response => {
            if (response == null) {
                console.log(response, 'IF NULL')
                db.collection('users').findOneAndUpdate({email: req.body.email}, {$set: {username: req.body.username.toLowerCase(), account_setup: true, user_metadata: {username: req.body.username, avatar: req.body.avatar}}})
                .then(response => res.status(200).json({status: 'sucess'}))
                .catch(error => console.error(error));
            } else {
                console.log(response, 'ELSE')
                res.status(301).send('Username not available')
            }
        })
});

module.exports = router;
