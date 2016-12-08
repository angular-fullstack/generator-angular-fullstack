'use strict';

exports = module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || <%= devPort %>,
  // List of user roles
  userRoles: ['guest', 'user', 'admin']
};
