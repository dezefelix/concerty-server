const config = require('../config/env');
const moment = require('moment');
const jwt = require('jwt-simple');

function encodeToken(email) {
  const payload = {
    exp: moment().add(2, 'days').unix(),
    iat: moment().unix(),
    sub: email
  };
  return jwt.encode(payload, config.secretKey);
}

function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, config.secretKey);

    const now = moment().unix();
    if (now > payload.exp) {
      console.log('User token has expired.');
    }

    cb(null, payload);
  } catch (err) {
    cb(err, null);
  }
}

module.exports = {
  encodeToken,
  decodeToken
};
