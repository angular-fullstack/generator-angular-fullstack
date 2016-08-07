/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
<%_ if(!filters.noModels) { -%>
import lusca from 'lusca';<% } %>
import config from './environment';<% if (filters.auth) { %>
import passport from 'passport';<% } %><% if(!filters.noModels) { %>
import session from 'express-session';<% } %><% if (filters.mongoose) { %>
<%_ if(semver.satisfies(nodeVersion, '>= 4')) { _%>
import connectMongo from 'connect-mongo';<% } else { _%>
import connectMongo from 'connect-mongo/es5';<% } %>
import mongoose from 'mongoose';
var MongoStore = connectMongo(session);<% } else if(filters.sequelize) { %>
import sqldb from '../sqldb';
import expressSequelizeSession from 'express-sequelize-session';
var Store = expressSequelizeSession(session.Store);<% } %>

export default function(app) {
  var env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }

  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.set('views', config.root + '/server/views');<% if (filters.html) { %>
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');<% } %><% if (filters.jade) { %>
  app.set('view engine', 'jade');<% } %>
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());<% if (filters.auth) { %>
  app.use(passport.initialize());<% } %>

  <% if(!filters.noModels) { %>
  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false<% if (filters.mongoose) { %>,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: '<%= lodash.slugify(lodash.humanize(appname)) %>'
    })<% } else if(filters.sequelize) { %>,
    store: new Store(sqldb.sequelize)<% } %>
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env !== 'test' && !process.env.SAUCE_USERNAME) {
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
  }<% } %>

  if ('development' === env) {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const stripAnsi = require('strip-ansi'); 
    const webpack = require('webpack');
    const makeWebpackConfig = require('../../webpack.make');
    const webpackConfig = makeWebpackConfig({ DEV: true });
    const compiler = webpack(webpackConfig);
    const browserSync = require('browser-sync').create(); 

    /**
     * Run Browsersync and use middleware for Hot Module Replacement
     */
    browserSync.init({
      open: false,
      logFileChanges: false,
      proxy: 'localhost:' + config.port,
      ws: true,
      middleware: [
        webpackDevMiddleware(compiler, {
          noInfo: false,
          stats: {
            colors: true,
            timings: true,
            chunks: false   
          }
        })
      ],
      port: config.browserSyncPort,
      plugins: ['bs-fullscreen-message']
    });

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    compiler.plugin('done', function (stats) {
      console.log('webpack done hook');
        if (stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: "Webpack Error:",
                body: stripAnsi(stats.toString()),
                timeout: 100000
            });
        }
        browserSync.reload();
    });
  }

  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
