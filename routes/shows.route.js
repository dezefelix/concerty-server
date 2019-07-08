const express = require('express');
const routes = express.Router();

routes.post('/', function (req, res) {
  let user = new User(req.body);

  user.save()
  .then(() => {
    console.log('User with email: "' + req.body.email + '" created');
    res.status(200).json(user);
  })
  .catch((error) => {
    console.log(error.message);
    res.status(400).json({error: "Could not create user"});
  })
});

routes.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  //check for matching user in DB
  User.findOne({email: email})
  .then((user) => {
    if (user) {

      //check password validity & return token if valid
      bcrypt.compare(password, user.password, function (error, response) {
        if (response) {
          res.status(200).json({token: auth.encodeToken(email)})
        } else {
          res.status(400).json({error: "Invalid password"})
        }
      });
    } else {
      res.status(400).json({error: "User does not exist"});
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({error: "Something went wrong"})
  })
});

routes.get('/', function (req, res) {
  res.contentType('application/json');

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

  User.findByIdAndUpdate(id, payload, {new: true})
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
