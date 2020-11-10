const express = require('express');
const axios = require('axios');
const router = express.Router();

//Search twitch channels
router.get('/channels', (req, res) => {
    let token = req.app.locals.access_token;
    let client_id = req.app.locals.client_id;
    let channel = req.query.channel;
    console.log('Token: ', 'client_id:', client_id)
    axios.get('https://api.twitch.tv/helix/search/channels', {params: {query: channel}, headers: {'client-id': client_id, 'Authorization': `Bearer ${token}`}})
        .then((response) => res.json(response.data.data))
        .catch((err) => console.log(err))
    
})

module.exports = router;
