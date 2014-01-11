'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000<% if (mongo) { %>,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }<% } %>
};