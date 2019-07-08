const express = require('express');
const routes = express.Router();

const hasher = require('../helpers/hasher');
const User = require('../models/user.model');

routes.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  //check for matching user in DB
  User.findOne({email: email})
    .then((user) => {
      if (user) {
        hasher.compare(password, user, (token) => {
          if (token) {
            res.status(200).json({token: token});
          } else {
            res.status(400).json({error: "Invalid credentials"})
          }

        });
      } else {
        res.status(400).json({error: "Invalid credentials"});
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Something went wrong"})
    })
});

module.exports = routes;
