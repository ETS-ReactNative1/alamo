var express = require('express');
var router = express.Router();

const user = {
    name: 'miller'
}

router.get('/', function(req, res, next) {
    console.log(req)
    res.json(user);
});

module.exports = router;
