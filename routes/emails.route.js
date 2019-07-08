const express = require('express');
const routes = express.Router();

const auth = require('../auth/authentication');
const User = require('../model/user.model');

routes.get('/users', function(req, res) {
    res.contentType('application/json');

    User.find({})
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not find all users"});
        });
});

routes.get('/users/:id', function(req, res) {
    const id = req.params.id;

    User.findById(id)
        .then((user) => res.status(200).json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not find user with given ID" });
        });
});

routes.post('/users', function(req, res) {
    const payload = req.body;
    const user = new User(payload);

    user.save()
        .then(() => res.status(200).send(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not create user"})
        });
});

routes.put('/users/:id', function(req, res) {
    const id = req.params.id;
    const payload = req.body;

    User.findByIdAndUpdate(id, payload, {new: true})
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not update user with given ID"});
        });
});

//delete all users
routes.delete('/users', function(req, res) {
    User.remove({})
        .then(() => {
            res.status(200).json({ success: "All users deleted"});
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not delete all users"});
        });
});

routes.delete('/users/:id', function(req, res) {
    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(422).json({ error: "Could not delete user with given ID" });
        });
});

//
//
//generic measurement query endpoints
//
//retrieve measurements from selected selected
routes.get('/users/:id/measurements', function(req, res) {
    const id = req.params.id;

    User.findById(id)
        .then((users) => {
            res.status(200).json(users.measurements);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json("Could not find all measurements from user with given ID");
        });
});

routes.get('/users/:id/measurements/:index', function(req, res) {
    const id = req.params.id;
    const index = req.params.index;

    User.findById(id)
        .then((users) => {
            res.status(200).json(users.measurements[index]);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not find measurement with given ID from user with given ID"});
        });
});

routes.post('/users/:id/measurements', function(req, res) {
    const id = req.params.id;
    const payload = req.body;

    User.findById(id)
        .then((user) => {
            user.measurements.push(payload);
            user.save()
                .then(() => res.status(200).json(payload))
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({ error: "Could not create measurement for user" });
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "User with given ID does not exist" });
        });
});

routes.delete('/users/:id/measurements', function(req, res) {
    const id = req.params.id;

    User.findById(id)
        .then((user) => {
            //empty the measurements array
            user.measurements.length = 0;
            user.save()
                .then(() => {
                    res.status(200).json({ success: "All (" + user.measurements.length + ") measurements deleted"});
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({ error: "Could not delete all measurements from user with given ID"})
                })
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not find user with given ID"})
        })
});

routes.delete('/users/:id/measurements/:index', function(req, res) {
    const id = req.params.id;
    const index = req.params.index;
    let measurement;

    User.findById(id)
        .then((user) => {
            measurement = user.measurements[index];
            user.measurements.splice(index, 1);
            user.save()
                .then(() => {
                    res.status(200).json(measurement);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({ error: "Could not delete measurement with given index from user with given ID" });
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Could not find user with given Id" });
        });
});

module.exports = routes;
