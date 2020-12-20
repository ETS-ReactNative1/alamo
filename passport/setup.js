const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require('../models/UserSchema') || mongoose.model('users');

// Reference - http://www.passportjs.org/docs/username-password/

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local Strategy
passport.use(
    'login-local', new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Match User
        User.findOne({ email: email })
            .then(user => {
                console.log(user)
                if (!user) {
                    return done(null, false, { message: 'Invalid Email/Password' });
                } else {
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        console.log(password, user.password, isMatch)
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Wrong password" });
                        }
                    });
                }
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

passport.use(
    'signup-local', new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Match User
        User.findOne({ email: email })
            .then(user => {
                // Create new User
                if (!user) {
                    const newUser = new User({ email, password });
                    console.log(newUser)
                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    console.log(user, 'AFTER SAVE')
                                    return done(null, user);
                                })
                                .catch(err => {
                                    return done(null, false, { message: err });
                                });
                        });
                    });
                } else {
                    return done(null, false, { message: "User already exists!" });
                }
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

passport.use(
    'change-password-local', new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Match User
        User.findOne({ email: email })
            .then(user => {
                // Create new User
                if (!user) {
                    return done(null, false, { message: "No user found." });
                } else {
                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            console.log(user, user.password)
                            if (err) throw err;
                            user.password = hash;
                            user.save()
                                .then(user => {
                                    console.log(user, 'AFTER SAVE')
                                    return done(null, user);
                                })
                                .catch(err => {
                                    return done(null, false, { message: err });
                               });
                        });
                    });
                }
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

passport.use(
    'reset-password-local', new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Match User
        console.log(token)
        User.findOne({ email: email })
            .then(user => {
                console.log(user)
                // Create new User
                if (!user) {
                    return done(null, false, { message: "No user found." });
                } else {
                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            console.log(user, user.password)
                            if (err) throw err;
                            user.password = hash;
                            user.save()
                                .then(user => {
                                    console.log(user, 'AFTER SAVE')
                                    return done(null, user);
                                })
                                .catch(err => {
                                    return done(null, false, { message: err });
                               });
                        });
                    });
                }
            })
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

module.exports = passport;
