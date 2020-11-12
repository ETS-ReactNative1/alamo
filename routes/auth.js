const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/user', (req, res) => {
    res.status(200).json(req.user)
})

router.post("/register_login", (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        if (!user) {
            return res.status(400).json({ errors: "No user found" });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(400).json({ errors: err });
            }
            console.log(req.session)
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    }) (req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.send('hello')
})

router.get('/check', function(req, res){
    res.send(req.isAuthenticated())
});

module.exports = router;
