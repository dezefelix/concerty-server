const express = require('express');
const routes = express.Router();

const hasher = require('../helpers/hasher');
const auth = require('../helpers/auth');
const User = require('../models/user.model');

routes.post('/login', ((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
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
      res.status(400).json({error: "Something went wrong"})
    })
}));

routes.get('renew/:token', ((req, res) => {
  const token = req.params.token;
  const newToken = auth.renewToken(token);
  res.status(200).json({ token: newToken });
}));

module.exports = routes;
