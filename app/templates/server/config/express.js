/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');<% if (filters.auth) { %>
var passport = require('passport');<% } %><% if (filters.twitterAuth) { %>
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose-bird')();<% } %>

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');<% if (filters.html) { %>
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');<% } %><% if (filters.jade) { %>
  app.set('view engine', 'jade');<% } %>
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());<% if (filters.auth) { %>
  app.use(passport.initialize());<% } %><% if (filters.twitterAuth) { %>

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  }));
<% } %>
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
