'use strict';

module.exports = {
  env: 'development'<% if (mongo) { %>,
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  }<% } %>
};