'use strict';

var express = require('express')<% if (mongo) { %>,
    path = require('path'),
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
<% } %><% if(mongo && mongoPassportUser) { %>
// Configuration
require('./lib/config/passport')();<% } %>
require('./lib/config/express')(app);

// Controllers
var api = require('./lib/controllers/api'),
    index = require('./lib/controllers');

// Server Routes
app.get('/api/awesomeThings', api.awesomeThings);
<% if(mongo && mongoPassportUser) { %>
var users = require('./lib/controllers/users');
app.post('/auth/users', users.create);
app.get('/auth/users/:id', users.show);
app.get('/auth/users/me', users.me);

var session = require('./lib/controllers/session');
app.post('/auth/session', session.login);
app.del('/auth/session', session.logout);<% } %>

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/*', index.index);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});

// Expose app
exports = module.exports = app;