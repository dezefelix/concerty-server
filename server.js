const express = require('express');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const mongodb = require('./connections/mongo.db'); // Starts mongodb.
const config = require('./config/config');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const artistRoute = require('./routes/artist.route');
const concertRoute = require('./routes/concert.route');
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
    // For development purposes only.
    // new RegExp(/.*/, 'i'),

    {url: '/api/auth/login', methods: ['POST', 'OPTIONS']},
    {url: '/api/artists', methods: ['GET', 'OPTIONS']},
    {url: '/api/concerts', methods: ['GET', 'OPTIONS']},
    {url: '/api/users', methods: ['GET', 'POST', 'OPTIONS']},
  ]
}));

app.set('port', (process.env.PORT || config.env.webPort));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Allow all origins (handy for development).
  // res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // OPTIONS is required for successful request.
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('*', function (req, res, next) {
  console.log(req.method + ' ' + req.originalUrl);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoute);
app.use('/api/concerts', concertRoute);
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
