const express = require('express');
const router = express.Router();

const user = {
    name: 'miller'
}

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const email = req.query.email
    console.log(user)
    db.collection('users').find({email: email}).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
});

module.exports = router;
