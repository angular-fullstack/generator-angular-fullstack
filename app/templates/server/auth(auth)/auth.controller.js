'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');

/**
 * Authenticate user and return an access token
 */
exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(401, { message: 'Something went wrong, please try again.'});

    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  })(req, res, next);
};

/**
 * Set token cookie directly for oAuth strategies
 */
exports.setToken = function(req, res, next) {
  if (!req.user) return res.json(401, { message: 'Something went wrong, please try again.'});
  var token = jwt.sign({_id: req.user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
};