/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');<% if (filters.mongoose) { %>
var mongoose = require('mongoose');<% } %>
var config = require('./config/environment');
<% if (filters.mongoose) { %>
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.sampleData) { require('./config/sample_data'); }

<% } %>// Setup server
var app = express();
var server = require('http').createServer(app);<% if (filters.socketio) { %>
var socketio = require('socket.io').listen(server);
require('./socketio')(socketio);<% } %>
require('./express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;