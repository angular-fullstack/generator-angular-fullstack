/**
 * Main application file
 */

'use strict';

import express from 'express';<% if (filters.mongoose) { %>
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');<% } %><% if (filters.sequelize) { %>
import sqldb from './sqldb';<% } %>
import config from './config/environment';
import http from 'http';
<% if (filters.mongoose) { %>
// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});
<% } %><% if (filters.models) { %>
// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }
<% } %>
// Setup server
var app = express();
var server = http.createServer(app);<% if (filters.socketio) { %>
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);<% } %>
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
<% if (filters.sequelize) { %>
sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });
<% } else { %>
setImmediate(startServer);
<% } %>
// Expose app
exports = module.exports = app;
