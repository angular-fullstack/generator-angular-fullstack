// Main application file

'use strict';

var express = require('express');
var mongoose = require('mongoose');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
