'use strict';

module.exports = {
  env: 'production'<% if (mongo) { %>,
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/fullstack'
  }<% } %>
};