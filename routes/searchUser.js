const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    let username = req.query.username;
    console.log(username, 'This is the source')

    db.collection('users').findOne({username: username})
    .then(response => {
        console.log(response)
        if (response == null) {
            res.status(301).json({status: 'no-user'})
        } else {
            res.status(200).json(response)
        }
    })
    .catch(error => console.error(error));
});

module.exports = router;
