const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const roomId = req.query.roomId;

    db.collection('rooms').find({_id: roomId}).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => console.error(error));
})

module.exports= router;
