const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

const auth = require('./auth');

function hash(password, cb) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, null, function (err, hash) {
      cb(hash);
    });
  });
}

function compare(password, user, cb) {
  bcrypt.compare(password, user.password, function (err, res) {
    if (res) {
      cb(auth.encodeToken(user.email));
    } else {
      cb(null);
      console.log(err);
    }
  });
}

module.exports = {
  hash, compare
};
