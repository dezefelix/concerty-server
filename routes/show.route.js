const express = require('express');
const routes = express.Router();

const Show = require('../models/show.model');

routes.get('/', function (req, res) {
  Show.find({})
    .then((shows) => {
      res.status(200).json(shows);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find all shows"});
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  Show.findById(id)
    .then((show) => res.status(200).json(show))
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find show with given ID"});
    });
});

routes.post('/', function (req, res) {
  const show = new Show(req.body);

  show.save()
    .then(() => {
      console.log('New show created');
      res.status(200).json(show);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not create show"});
    })
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  const payload = req.body;

  Show.findByIdAndUpdate(id, payload, { new: true })
    .then((show) => {
      res.status(200).json(show);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not update show"});
    });
});

routes.delete('/', function (req, res) {
  Show.remove({})
    .then(() => {
      res.status(200).json({success: "All shows deleted"});
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not delete shows"});
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;

  Show.findByIdAndRemove(id)
    .then((show) => {
      res.status(200).json(show);
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({error: "Could not delete show"});
    });
});

module.exports = routes;
