'use strict';

var api = require('./controllers/api'),
    index = require('./controllers')<% if(mongoPassportUser) { %>,
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    passport = require('passport');

var middleware = require('./middleware')<% } %>;

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  <% if(mongoPassportUser) { %>
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);<% } %>

  // Authentication Routes
  <% if (mongoPassportFacebook) { %>
  // Setting the Facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
          scope: ['email', 'user_about_me'],
          failureRedirect: '/signin'
      }), session.login);

      app.get('/auth/facebook/callback', passport.authenticate('facebook', {
          failureRedirect: '/signin'
      }), users.authCallback);
  <% } %>

  <% if (mongoPassportTwitter) { %>
  // Setting the Twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
          failureRedirect: '/signin'
      }), session.login);

      app.get('/auth/twitter/callback', passport.authenticate('twitter', {
          failureRedirect: '/signin'
      }), users.authCallback);
  <% } %>

  <% if (mongoPassportGoogle) { %>
  // Setting the Google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
          failureRedirect: '/signin',
          scope: [
              'https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email'
          ]
      }), session.login);

      app.get('/auth/google/callback', passport.authenticate('google', {
          failureRedirect: '/signin'
      }), users.authCallback);
  <% } %>

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*',<% if(mongoPassportUser) { %> middleware.setUserCookie,<% } %> index.index);
};
