'use strict';

module.exports = {
  env: 'production'<% if (mongo) { %>,
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/fullstack'
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
  }<% } %><% if (mogoPassportGoogle) { %>,
  google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
  }<% } %>
};
