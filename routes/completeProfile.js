const express = require('express');
const router = express.Router();

const user = {
    name: 'miller'
}

router.post('/', (req, res) => {
    const db = req.app.locals.db;

    db.collection('users').findOneAndUpdate({email: req.body.email}, {$set: {account_setup: true, user_metadata: {username: req.body.username, avatar: req.body.avatar}}})
    .then(response => res.json({status: 'success'}))
    .catch(error => console.error(error));
});

module.exports = router;
