'use strict';

module.exports = {
  env: 'development'<% if (mongo) { %>,
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  }<% } %><% if (mongoPassportFacebook) { %>,
  facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
  }<% } %><% if (mongoPassportTwitter) { %>,
  twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
  }<% } %><% if (mongoPassportGoogle) { %>,
  google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
  }<% } %>
};
