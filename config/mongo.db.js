const mongoose = require('mongoose');
const config = require('./env');

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl, {useMongoClient: true});
const connection = mongoose.connection
.once('open', () => console.log('Connected to Mongo on ' + config.dbUrl))
.on('error', (error) => {
  console.warn('Warning', error.toString());
});

module.exports = connection;
