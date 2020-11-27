const express = require('express');
const axios = require('axios');
const router = express.Router();


// Search twitch channels
// http://localhost:8080/twitchapi/channels?channel=nemix
router.get('/channels', (req, res) => {
    let token = req.app.locals.access_token;
    let client_id = req.app.locals.client_id;
    let headers = {'client-id': client_id, 'Authorization': `Bearer ${token}`}

    let channel = req.query.channel;
    console.log('Token: ', 'client_id:', client_id)
    axios.get('https://api.twitch.tv/helix/search/channels', {params: {query: channel}, headers: headers})
        .then((response) => res.json(response.data.data))
        .catch((err) => console.log(err))
})

// Get top games
// http://localhost:8080/twitchapi/top-games
router.get('/top-games', (req, res) => {
    let token = req.app.locals.access_token;
    let client_id = req.app.locals.client_id;
    let headers = {'client-id': client_id, 'Authorization': `Bearer ${token}`}

    axios.get('https://api.twitch.tv/helix/games/top', {headers: headers})
        .then((response) => res.json(response.data.data))
        .catch((err) => console.log(err))
})

// Get streams
// http://localhost:8080/twitchapi/streams?search=dev1ce
router.get('/streams', (req, res) => {
    let token = req.app.locals.access_token;
    let client_id = req.app.locals.client_id;
    let headers = {'client-id': client_id, 'Authorization': `Bearer ${token}`}
    let search = req.query.search;
    let params = {}

    if (req.query.user_id)
        params = {user_id: req.query.user_id}

    if (req.query.game_id)
        params = {game_id: req.query.game_id}

    console.log(req.query.game_id, "GAME IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

    console.log(params, 'THIS IS PARAMS')
    //const ids = ['31239503', '173162545'];
    //const games = ['32399']
    //const x = new URLSearchParams();

    //games.forEach((game) => {
    //    x.append('game_id', game)
    //})

    axios.get('https://api.twitch.tv/helix/streams', {params: params, headers: headers})
        .then((response) => {
            res.json(response.data.data) 
        })
        .catch((err) => console.log(err))
})

module.exports = router;
