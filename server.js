const express = require('express');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const mongodb = require('./config/mongo.db');
const config = require('./config/env');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/users.route');
const artistsRoute = require('./routes/artists.route');
const showsRoute = require('./routes/shows.route');

let app = express();

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(expressJWT({
  secret: config.secretKey,
  getToken: (req) => {
    return req.headers.authorization;
  }
}).unless({
  path: [
    {url: '/api/auth/login', methods: ['POST']},
    {url: '/api/shows', methods: ['GET']},
    {url: '/api/artists', methods: ['GET']}
  ]
}));

app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('*', function (req, res, next) {
  console.log(req.method + ' ' + req.originalUrl);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artists', artistsRoute);
app.use('/api/shows', showsRoute);

app.use('*', function (req, res) {
  res.status(404);
  res.json({
    'error': 'This is not a valid URL.'
  });
});

// Start server.
app.listen(config.env.webPort, function () {
  console.log('Server listening on ' + app.get('port') + '...');
});

module.exports = app;
