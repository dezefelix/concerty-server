const express = require('express');
const routes = express.Router();

const hasher = require('../helpers/hasher');
const User = require('../models/user.model');

routes.post('/', function (req, res) {
  let password = req.body.password;
  let user = new User(req.body);

  hasher.hash(password, (hash) => {
    user.password = hash;

    user.save()
      .then(() => {
        console.log('User with email: "' + req.body.email + '" created');
        res.status(200).json(user);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({error: "Could not create user"});
      })
  });
});

routes.get('/', function (req, res) {

  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find all users"});
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find user with given ID"});
    });
});

routes.post('/', function (req, res) {
  const payload = req.body;
  const user = new User(payload);

  user.save()
    .then(() => res.status(200).send(user))
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not create user"})
    });
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  const payload = req.body;

  User.findByIdAndUpdate(id, payload, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not update user with given ID"});
    });
});

//delete all users
routes.delete('/', function (req, res) {
  User.remove({})
    .then(() => {
      res.status(200).json({success: "All users deleted"});
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not delete all users"});
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({error: "Could not delete user with given ID"});
    });
});

module.exports = routes;
