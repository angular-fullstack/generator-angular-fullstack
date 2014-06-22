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
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  sampleData: true,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: '<%= _.slugify(_.humanize(appname)) + '-secret' %>'
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
<% if(filters.facebookAuth) { %>
  facebook: {
    clientID:     requiredProcessEnv('FACEBOOK_ID'),
    clientSecret: requiredProcessEnv('FACEBOOK_SECRET'),
    callbackURL:  'http://localhost:9000/auth/facebook/callback'
  },
<% } %><% if(filters.twitterAuth) { %>
  twitter: {
    clientID:     requiredProcessEnv('TWITTER_ID'),
    clientSecret: requiredProcessEnv('TWITTER_SECRET'),
    callbackURL:  'http://localhost:9000/auth/twitter/callback'
  },
<% } %><% if(filters.googleAuth) { %>
  google: {
    clientID:     requiredProcessEnv('GOOGLE_ID'),
    clientSecret: requiredProcessEnv('GOOGLE_SECRET'),
    callbackURL:  'http://localhost:9000/auth/google/callback'
  }<% } %>
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});