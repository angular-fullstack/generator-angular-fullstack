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
<%_ if (filters.ws) { -%>
import initWebSocketServer from './config/websockets';<% } %>
import expressConfig from './config/express';
import registerRoutes from './routes';

<% if (filters.mongoose) { %>
// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1); // eslint-disable-line no-process-exit
});
<% } %><% if(filters.models) { %>
// Populate databases with sample data
if(config.seedDB) {
  require('./config/seed');
}
<% } %>
// Setup server
var app = express();
var server = http.createServer(app);
<%_ if(filters.ws) { -%>
const wsInitPromise = initWebSocketServer(server);<% } %>
expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
<% if(filters.sequelize) { %>
sqldb.sequelize.sync()
  <%_ if(filters.ws) { -%>
  .then(wsInitPromise)<% } %>
  .then(startServer)
  .catch(err => {
    console.log('Server failed to start due to error: %s', err);
  });
<% } else { %>
<%_ if(filters.ws) { -%>
wsInitPromise
  .then(startServer)
  .catch(err => {
    console.log('Server failed to start due to error: %s', err);
  });<% } %>
<%_ if(!filters.ws) { -%>
setImmediate(startServer);<% } %>
<% } %>
// Expose app
exports = module.exports = app;
