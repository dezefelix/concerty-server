const express = require('express');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const mongodb = require('./connections/mongo.db');
const config = require('./config/config');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const artistRoute = require('./routes/artist.route');
const showRoute = require('./routes/show.route');
const ticketRoute = require('./routes/ticket.route');

const app = express();

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(expressJWT({
  secret: config.secretKey,
  getToken: (req) => {
    return req.headers.authorization;
  }
}).unless({
  path: [
    {url: '/api/auth/login', methods: ['POST']},
    {url: '/api/users', methods: ['POST']},

    // Temporarily for server development...
    {url: '/api/users', methods: ['GET', 'POST', 'PUT']},
    {url: '/api/artists', methods: ['GET', 'POST', 'PUT']},
    {url: '/api/tickets', methods: ['GET', 'POST', 'PUT']},
    {url: '/api/shows', methods: ['GET', 'POST', 'PUT']},
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
app.use('/api/artists', artistRoute);
app.use('/api/shows', showRoute);
app.use('/api/tickets', ticketRoute);

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
