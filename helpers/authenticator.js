const config = require("../config/config");
const moment = require("moment");
const jwt = require("jwt-simple");

const expiryDuration = 10;
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

function decodeToken(token, cb) {
  try {
    const payload = jwt.decode(token, config.secretKey);
    const now = moment().unix();
    console.log(payload);

    if (now > payload.exp) {
      cb('Log in to authorize', null);
    } else {
      cb(null, payload);
    }
  } catch (err) {
    console.log(err);
    cb('No authorization', null);
  }
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

module.exports = {
  encodeToken,
  decodeToken,
  renewToken
};
