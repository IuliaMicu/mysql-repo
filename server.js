require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var key = fs.readFileSync('../selfsigned.key');
var cert = fs.readFileSync('../selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

app.options('*', cors())


// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));

// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8081;

var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});
// app.listen(port, () => console.log('Server listening on port ' + port));
