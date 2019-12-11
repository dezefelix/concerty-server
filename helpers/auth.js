const config = require('../config/config');
const moment = require('moment');
const jwt = require('jwt-simple');

const expiryDuration = 1;
const expiryMetric = 'days';

function encodeToken(email, role) {
  const payload = {
    exp: moment().add(expiryDuration, expiryMetric).unix(),
    iat: moment().unix(),
    sub: email,
    role: role
  };

  return jwt.encode(payload, config.secretKey);
}

// TODO: Should create a function in auth route to use this function.
function renewToken(token) {
  try {
    const payload = jwt.decode(token, config.secretKey);
    payload.exp = moment().add(expiryDuration, expiryMetric);
    payload.iat = moment().unix();
    return jwt.encode(payload, config.secretKey);
  } catch (err) {
    return null;
  }
}

function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, config.secretKey);

    const now = moment().unix();
    if (now > payload.exp) {
      cb('Token expired', null);
    } else {
      cb(null, payload);
    }
  } catch (err) {
    cb(err, null);
  }
}

module.exports = {
  encodeToken,
  decodeToken
};
