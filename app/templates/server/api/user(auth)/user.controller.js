'use strict';

var User = require('./user.model');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).json(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  // If the ID is not a valid mongoose ObjectID, return 404
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).end();
  }

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).end();
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  // If the ID is not a valid mongoose ObjectID, return 404
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).end();
  }
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).json(err);
    return res.status(204).end();
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).end();
      });
    } else {
      res.status(403).end();
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).end();
    res.status(200).json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};
