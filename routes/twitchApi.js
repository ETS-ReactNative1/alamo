const express = require('express');
const axios = require('axios');
const router = express.Router();


/// Search twitch channels
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

router.get('/query-twitch', (req, res) => {
    let token = req.app.locals.access_token;
    let client_id = req.app.locals.client_id;
    let headers = {'client-id': client_id, 'Authorization': `Bearer ${token}`}
    
    let games = new Set();
    let channel = req.query.channel;

    // Due to the design of twitchs api, users can not query a title or stream using the /stream endpoint. This only returns popular streams across it entire platform. However the /streams endpoint does that a game_id. 
    // So when a user types in the search bar, the query is trying to make channels to that query. This is good and these are returned and displayed separately
    // However if the user meant to query a title or game, then it wouldnt make sense to only send back a channel. So all possible games related to the list of channels are queried and returns the most popular active stream for that game.
    // This works well and is a work around for twitchs api design
    axios.get('https://api.twitch.tv/helix/search/channels', {params: {query: channel}, headers: headers})
        .then((response) => {
            const channels = response.data.data
            channels.forEach((channel) => {
                games.add(channel.game_id)
            })

            const params = new URLSearchParams();

            games.forEach((game) => {
                params.append('game_id', game)
            })

            axios.get('https://api.twitch.tv/helix/streams', {params: params, headers: headers})
                .then((streams) => {
                    //Send back collection of both channels and streams
                    res.json({channels: response.data.data, streams: streams.data.data})
                })
                .catch((err) => console.log(err))

        })
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
