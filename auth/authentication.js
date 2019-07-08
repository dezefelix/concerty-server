const settings = require('../config/config.json');
const moment = require('moment');
const jwt = require('jwt-simple');

//encode (from username to token)
function encodeToken(email) {
    const payload = {
        exp: moment().add(1, 'days').unix(),
        iat: moment().unix(),
        sub: email
    };
    return jwt.encode(payload, settings.secretKey);
}

//decode (from token to username)
function decodeToken(token, cb) {
    try {
        const payload = jwt.decode(token, settings.secretKey);

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('User token has expired.');
        }

        //return
        cb(null, payload);
    } catch (err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};