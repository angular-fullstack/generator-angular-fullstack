'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000<% if (mongo) { %>,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }<% } %>
};