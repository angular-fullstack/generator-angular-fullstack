'use strict';

var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('./user.model');
var config = require('../../config/environment');

var validationError = function(res, err) {
  return res.json(422, err);
};

var excludedFields = '-salt -hashedPassword';

// Create new LocalStrategy user
exports.create = function(req, res) {
  User.create(req.body, function(err, user) {
    if (err) return validationError(res, err);

    var token = jwt.sign({ _id: user._id }, config.secrets.session, { expiresInMinutes: 30 * 24 * 60 });
    res.json({ token: token });
  });
};

// Get a single user
exports.show = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    return res.json(user.profile);
  });
};

// Change user's password
exports.changePassword = function(req, res) {
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(req.user._id, function(err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);

        res.send(200);
      });

    } else res.send(403);
  });
};
<% if (filters.oauth) { %>
// Set password (vel. enable LocalStrategy)
exports.setPassword = function(req, res) {
  User.findById(req.user._id, function(err, user) {
    // TODO: should anything else except jwt be checked here?
    if (true) {
      user.password = String(req.body.newPassword);
      user.save(function(err) {
        if (err) return validationError(res, err);

        res.send(200);
      });

    } else res.send(403);

  });
};
<% } %>
// Change email
exports.changeEmail = function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if (err) return res.send(500, err);
    if (!user) return res.json(404);

    user.changeEmail(req.body.oldEmail, req.body.newEmail, function(err) {
      if (err) return res.send(500, err);

      res.send(200, user);
    });
  });
};

// Get currently logged in user info
exports.me = function(req, res, next) {
  User.findById(req.user._id, excludedFields, function(err, user) {
    if (err) return next(err);
    if (!user) return res.json(404);
    res.json(user);
  });
};

// Authentication callback
exports.authCallback = function(req, res) {
  return res.redirect('/');
};


/**
 * Admin methods
 **/

// Get list of users
exports.index = function(req, res) {
  User.find({}, excludedFields, function(err, users) {
    if (err) return res.send(500, err);

    res.json(200, users);
  });
};

exports.confirm = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.send(500, err);

    user.confirm(user.email, function(err) {
      if (err) return res.send(500, err);

      res.send(200, user);
    });
  });
};

//  Delete a user
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) return res.send(500, err);

    res.send(204);
  });
};