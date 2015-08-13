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
var lusca = require('lusca');
var config = require('./environment');<% if (filters.auth) { %>
var passport = require('passport');<% } %>
var session = require('express-session');<% if (filters.mongoose) { %>
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');<% } else if(filters.sequelize) { %>
var sqldb = require('../sqldb');
var Store = require('express-sequelize-session')(session.Store);<% } %>

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
  app.use(passport.initialize());<% } %>

  // Persist sessions with mongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true<% if (filters.mongoose) { %>,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: '<%= _.slugify(_.humanize(appname)) %>'
    })<% } else if(filters.sequelize) { %>,
    store: new Store(sqldb.sequelize)<% } %>
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if ('test' !== env) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  app.set('appPath', path.join(config.root, 'client'));

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
