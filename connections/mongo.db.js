const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.Promise = global.Promise;

console.log(config.dbUrl);
console.log(config.dbUrl);
console.log(config.dbUrl);
mongoose.connect(config.dbUrl, { useNewUrlParser: true });
const connection = mongoose.connection
.once('open', () => console.log('Connected to Mongo on ' + config.dbUrl))
.on('error', (error) => {
  console.warn('Warning', error.toString());
});

module.exports = connection;
