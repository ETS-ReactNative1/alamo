const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const db = req.app.locals.db;

    console.log(req.query.username, 'CONSOLE')

    db.collection('users').findOne({username: req.query.username.toLowerCase()})
    .then(response => {
        if (response == null) {
            res.status(301).json({status: 'no-user'})
        } else {
            res.status(200).json(response)
        }
    })
    .catch(error => console.error(error));
});

module.exports = router;
