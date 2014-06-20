'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config')<% if (mongoPassportUser) { %>,
    passport = require('passport'),
    mongoStore = require('connect-mongo')(session)<% } %>;

/**
 * Express configuration
 */
module.exports = function(app) {
  var env = app.get('env');

  if ('development' === env) {
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
  }

  if ('production' === env) {
    app.use(compression());
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  }
<% if (!jade) { %>
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');<% } %><% if (jade) { %>
  app.set('view engine', 'jade');<% } %>
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());<% if(mongoPassportUser) { %>
  app.use(cookieParser());

  var sessionStore = new mongoStore({
    url: config.mongo.uri,
    collection: 'sessions'
  }, function(err) {
    if (!err) {
      console.log('db connection open, now using');
      app.use(session({
        secret: 'angular-fullstack secret',
        store: sessionStore
      }));
    } else {
      console.log('db connection failed');
    }
  });


  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());<% } %>

  // Error handler - has to be last
  if ('development' === app.get('env')) {
    app.use(errorHandler());
  }
};