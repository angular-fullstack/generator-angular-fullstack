'use strict';
<% if (filters.mongooseModels) { %>
import User from './user.model';<% } %><% if (filters.sequelizeModels) { %>
import {User} from '../../sqldb';<% } %>
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  <% if (filters.mongooseModels) { %>User.findAsync({}, '-salt -password')<% }
     if (filters.sequelizeModels) { %>User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  })<% } %>
    .then(function(users) {
      res.status(200).json(users);
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  <% if (filters.mongooseModels) { %>var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()<% }
     if (filters.sequelizeModels) { %>var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save()<% } %>
    <% if (filters.mongooseModels) { %>.spread(function(user) {<% }
       if (filters.sequelizeModels) { %>.then(function(user) {<% } %>
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  <% if (filters.mongooseModels) { %>User.findByIdAsync(userId)<% }
     if (filters.sequelizeModels) { %>User.find({
    where: {
      _id: userId
    }
  })<% } %>
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  <% if (filters.mongooseModels) { %>User.findByIdAndRemoveAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %>User.destroy({ _id: req.params.id })<% } %>
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  <% if (filters.mongooseModels) { %>User.findByIdAsync(userId)<% }
     if (filters.sequelizeModels) { %>User.find({
    where: {
      _id: userId
    }
  })<% } %>
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        <% if (filters.mongooseModels) { %>return user.saveAsync()<% }
           if (filters.sequelizeModels) { %>return user.save()<% } %>
          .then(function() {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  <% if (filters.mongooseModels) { %>User.findOneAsync({ _id: userId }, '-salt -password')<% }
     if (filters.sequelizeModels) { %>User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  })<% } %>
    .then(function(user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
