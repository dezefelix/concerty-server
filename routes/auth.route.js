const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();

const auth = require('../auth/authentication');
const User = require('../model/user.model');
const saltRounds = 10;

//register a customer
router.post('/register', function (req, res) {
    let password = req.body.password;
    let user = new User(req.body);

    //hash password
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, null, function (err, hash) {
            user.password = hash;
        });
    });

    user.save()
        .then(() => {
            console.log('#User with email: "' + req.body.email + '" created');
            res.status(200).json(user);
        })
        .catch((error) => {
            console.log(error.message);
            res.status(400).json({ error: "Could not create user" });
        })
});

//log a user in by returning a valid token
router.post('/login', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    //check for matching user in DB
    User.findOne({ email: email })
        .then((user) => {
            if (user) {

                //check password validity & return token if valid
                bcrypt.compare(password, user.password, function(error, response) {
                    if (response) {
                        res.status(200).json({ token: auth.encodeToken(email) })
                    } else {
                        res.status(400).json({ error: "Invalid password" })
                    }
                });
            } else {
                res.status(400).json({ error: "User does not exist" });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Something went wrong" })
        })
});

module.exports = router;
