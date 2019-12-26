const express = require('express');
const routes = express.Router();

const Ticket = require('../models/ticket.model');

// Essentially unused cuz i switched to embedded docs and am neglecting the RUD from CRUD in this assignment.

routes.get('/', function (req, res) {
  Ticket.find({})
    .then((tickets) => {
      res.status(200).json(tickets);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find tickets"});
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  Ticket.findById(id)
    .then(ticket => res.status(200).json(ticket))
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find ticket"});
    });
});

routes.post('/', function (req, res) {
  let ticket = new Ticket(req.body);

  ticket.save()
    .then((ticket) => {
      console.log(`Ticket ${ticket.key}`);
      res.status(200).json(ticket);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not create ticket"});
    })
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  const payload = req.body;

  Ticket.findByIdAndUpdate(id, payload, { new: true })
    .then((ticket) => {
      res.status(200).json(ticket);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not update ticket with given ID"});
    });
});

//delete all tickets
routes.delete('/', function (req, res) {
  Ticket.remove({})
    .then(() => {
      res.status(200).json({success: "All tickets deleted"});
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not delete tickets"});
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;

  Ticket.findByIdAndRemove(id)
    .then((ticket) => {
      res.status(200).json(ticket);
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({error: "Could not delete ticket with given ID"});
    });
});

module.exports = routes;
