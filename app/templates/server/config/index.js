'use strict';

var path = require('path');
var _ = require('lodash');
var requiredProcessEnv = require('./helpers/required_env');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  sampleData: true,

  // Secret for session, should be unqiue
  secrets: {
    session: requiredProcessEnv('SESSION_SECRET')
  },

  // List of user roles, ordered worst to best
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // Social oauth configurations
  facebook: {
    clientID:     requiredProcessEnv('FACEBOOK_ID'),
    clientSecret: requiredProcessEnv('FACEBOOK_SECRET'),
    callbackURL:  'http://localhost:9000/auth/facebook/callback'
  },

  twitter: {
    clientID:     requiredProcessEnv('TWITTER_ID'),
    clientSecret: requiredProcessEnv('TWITTER_SECRET'),
    callbackURL:  'http://localhost:9000/auth/twitter/callback'
  },

  google: {
    clientID:     requiredProcessEnv('GOOGLE_ID'),
    clientSecret: requiredProcessEnv('GOOGLE_SECRET'),
    callbackURL:  'http://localhost:9000/auth/google/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});