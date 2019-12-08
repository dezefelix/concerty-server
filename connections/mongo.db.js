const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl.toString(), { useNewUrlParser: true });
const connection = mongoose.connection
  .once('open', () => console.log('Connected to Mongo on ' + config.dbUrl))
  .on('error', (error) => {
    console.warn('Warning', error.toString());
  });

module.exports = connection;
