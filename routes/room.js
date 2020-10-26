const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const io = req.app.locals.io

    io.on('connection', (socket) => {
        io.emit('room', 'welcome')
    })
});

module.exports = router;
