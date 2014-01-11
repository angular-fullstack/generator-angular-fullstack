'use strict';

module.exports = {
  env: 'test'<% if (mongo) { %>,
  mongo: {
    uri: 'mongodb://localhost/fullstack-test'
  }<% } %>
};