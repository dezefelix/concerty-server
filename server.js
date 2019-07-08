const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./config/mongo.db');
const expressJWT = require('express-jwt');

const settings = require('./config/env/env');
const config = require('./config/config.json');
const authRoutes = require('./routes/auth.route');

let app = express();

module.exports = {};

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Beveilig alle URL routes, tenzij het om /login of /register gaat.
app.use(expressJWT({
    secret: config.secretKey
}).unless({
    path: [
        { url: '/api/v1/login', methods: ['POST'] },
        { url: '/api/v1/register', methods: ['POST'] }
    ]
}));

//configure app
app.set('port', (process.env.PORT || settings.env.webPort));
app.set('env', (process.env.ENV || 'development'));

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//log request method & URL
app.use('*', function(req, res, next) {
   console.log(req.method + ' ' + req.originalUrl);
   next();
});

//install routes
app.use('/api/v1', authRoutes);

//fallback route
app.use('*', function (req, res) {
    res.status(404);
    res.json({
        'error': 'This is not a valid URL.'
    });
});

//installation complete; start server
app.listen(settings.env.webPort, function () {
    console.log('Server listening on ' + app.get('port') + '...');
});

module.exports = app;
