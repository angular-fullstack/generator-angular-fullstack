'use strict';

var ejwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../../api/user/user.model');
var config = require('../../config');

/**
 * Attaches a user to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated(req, res, next) {
  return ejwt({ secret: config.secrets.session })(req, res, next);
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated)
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        if (config.userRoles.indexOf(user.role) >= config.userRoles.indexOf(roleRequired)) {
          next();
        }
        else {
          res.send(403);
        }
      });
    });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;