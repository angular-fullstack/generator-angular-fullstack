'use strict';

// Module dependencies.
var express = require('express'),
  http = require('http'),
  path = require('path')<% if (mongo) { %>,
  fs = require('fs')<% } %>;

var app = express();
<% if (mongo) { %>
// Connect to database
  var db = require('./lib/db/mongo');

// Bootstrap models
  var modelsPath = path.join(__dirname, 'lib/models');
  fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
  });

// Populate empty DB with dummy data
require('./lib/db/dummydata');
<% } %>
// Controllers
var api = require('./lib/controllers/api');

// Express Configuration
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
}

if ('production' === app.get('env')) {
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
}

// Routes
app.get('/api/awesomeThings', api.awesomeThings);

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});