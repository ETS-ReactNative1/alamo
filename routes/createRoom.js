const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const roomId = req.body.roomId
    const userId = req.body.userId
    const roomTitle = req.body.roomTitle

    //Store new room in db
    db.collection('rooms').insertOne({_id: roomId, roomTitle: roomTitle})
    .then(response => res.status(200).json({status: 'sucess'}))
    .catch(error => console.error(error));
});

module.exports = router;
