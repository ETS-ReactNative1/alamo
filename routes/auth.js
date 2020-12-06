const express = require("express");
const router = express.Router();
const passport = require("passport");
const { v1 : uuidv1 } = require('uuid');
const nodemailer = require('nodemailer');
const uuidTime = require('uuid-time');
const User = require('../models/UserSchema') || mongoose.model('users');

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: 'alamonoreply@gmail.com',
    pass: 'Kittylitter1'
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.get('/user', (req, res) => {
    res.status(200).json(req.user)
})

router.post("/login", (req, res, next) => {
    passport.authenticate("login-local", function(err, user, info) {
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
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    }) (req, res, next);
});

router.post("/signup", (req, res, next) => {
    passport.authenticate("signup-local", function(err, user, info) {
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
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    }) (req, res, next);
});

router.post("/change-password", (req, res, next) => {
    passport.authenticate("change-password-local", function(err, user, info) {
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
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    }) (req, res, next);
});

router.post('/request-password-reset-token', (req, res) => {
    const email = req.body.email
    const v1options = {
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
    };

    const token = uuidv1(v1options);
    User.updateOne({email: email}, {$set : {resetPasswordToken: token}})
        .then((response) => {
            if (response !== null) {
                const mail = {
                    from: 'alamonoreply@gmail.com',
                    to: email,
                    subject: `Alamo - Password Reset`,
                    text: `To reset password, please following this link - https://alamo-d19124355.herokuapp.com/reset/${token}`
                }

                transporter.sendMail(mail, (err, data) => {
                    if (err) res.json({msg: 'fail'})
                    else res.json({msg: 'success'})
                })
            } else {
                console.log('No user')
            }
        })

})

router.get('/check-token/:token', (req, res) => {
    const token = req.params.token;
    const tokenTime = uuidTime.v1(token)
    const tokenExpiration = new Date(tokenTime)
    const current = Date.now();
    const anHourAgo = 60 * 60 * 1000;

    if (tokenExpiration > (current - anHourAgo)) {
        User.findOne({resetPasswordToken: token},)
            .then((user) => {
                if (user != null)
                    res.status(200).json({status: 'isValid', user: user})
                else
                    res.status(401).json({status: 'notValid'})
            })
    }
    else {
        res.status(401).json({status: 'notValid'})
    }
})


router.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200).send('user logged out')
})

router.get('/check', function(req, res){
    res.json({auth: req.isAuthenticated(), user: req.user})
});

module.exports = router;
