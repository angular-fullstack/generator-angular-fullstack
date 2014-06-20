'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

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

  // Secret for session, should be unique
  secrets: {
    session: requiredProcessEnv('SESSION_SECRET')
  },

  // List of user roles
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
  require('./config.' + process.env.NODE_ENV + '.js') || {});