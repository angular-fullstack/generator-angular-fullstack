'use strict';

var mongoose = require('mongoose'),
  passport = require('passport');

/**
 * Session status
 */
exports.status = function (req, res) {
  if (req.user) {
    res.json(JSON.stringify(req.user.userInfo));
  } else {
    res.send(401);
  }
};

/**
 * Logout
 */
exports.logout = function (req, res) {
  if(req.user) {
    req.logout();
    res.send(200);
  } else {
    res.send(400, "Not logged in");
  }
};

/**
 * Login
 * Use passports callback to add some extra error handling
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    req.logIn(user, function(err) {
      if (err) return res.send(err);
      
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};