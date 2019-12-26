const express = require('express');
const routes = express.Router();
const Concert = require('../models/concert.model');

routes.get('/', function (req, res) {
  Concert.find({})
    .then(concerts => {
      res.status(200).json(concerts);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find all concerts"});
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  Concert.findById(id)
    .then(concert => {
      res.status(200).json(concert);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find concert with given ID"});
    });
});

routes.post('/', function (req, res) {
  let concert = new Concert(req.body);

  concert.save()
    .then(() => {
      res.status(200).send(concert);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not create concert"});
    })
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  let payload = req.body;

  Concert.findByIdAndUpdate(id, payload, {new: true})
    .then((concert) => {
      res.status(200).json(concert);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not update concert"});
    });
});

routes.delete('/', function (req, res) {
  Concert.remove({})
    .then(() => {
      res.status(200).json({success: "All concerts deleted"});
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not delete concerts"});
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;

  Concert.findByIdAndRemove(id)
    .then(concert => {
      res.status(200).send(concert);
    })
    .catch(error => {
      console.log(error);
      res.status(422).json({error: "Could not delete concert"});
    });
});

module.exports = routes;
