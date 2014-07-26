'use strict';

var mongoose    = require('mongoose');
var passport    = require('passport');
var jwt         = require('jsonwebtoken');
var expressJwt  = require('express-jwt');
var compose     = require('composable-middleware');

var config      = require('../config/environment');
var User        = require('../api/user/user.model');

var validateJwt = expressJwt({ secret: config.secrets.session });


// Attaches the user object to the request if authenticated
// Otherwise returns 403
var isAuthenticated = function() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    });
};

// Checks if the user role meets the minimum requirements of the route
var hasRole = function(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();

      } else res.send(403);
    });
};

// Returns a jwt token signed by the app secret
var signToken = function(id, role) {
  var payload = { _id: id };
  if (role !== null) payload.role = role;

  return jwt.sign(payload, config.secrets.session, { expiresInMinutes: 30 * 24 * 60 }); // 30 days
};

// Set token cookie directly for oAuth strategies
var setTokenCookie = function(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again' });

  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
};

module.exports = {
  isAuthenticated: isAuthenticated,
  hasRole: hasRole,
  signToken: signToken,
  setTokenCookie: setTokenCookie
};