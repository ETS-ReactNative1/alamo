const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const email = req.query.email
    db.collection('users').find({email: email}).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
});

module.exports = router;
