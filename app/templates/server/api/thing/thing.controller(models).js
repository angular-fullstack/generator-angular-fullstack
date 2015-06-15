/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');<% if (filters.mongooseModels) { %>
var Thing = require('./thing.model');<% } %><% if (filters.sequelizeModels) { %>
var sqldb = require('../../sqldb')
var Thing = sqldb.Thing;<% } %>

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    <% if (filters.mongooseModels) { %>var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {<% }
       if (filters.sequelizeModels) { %>return entity.updateAttributes(updates)
      .then(function(updated) {<% } %>
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      <% if (filters.mongooseModels) { %>return entity.removeAsync()<% }
         if (filters.sequelizeModels) { %>return entity.destroy()<% } %>
        .then(function() {
          return res.status(204).end();
        });
    }
  };
}

// Get list of things
exports.index = function(req, res) {
  <% if (filters.mongooseModels) { %>Thing.findAsync()<% }
     if (filters.sequelizeModels) { %>Thing.findAll()<% } %>
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  <% if (filters.mongooseModels) { %>Thing.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %>Thing.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  <% if (filters.mongooseModels) { %>Thing.createAsync(req.body)<% }
     if (filters.sequelizeModels) { %>Thing.create(req.body)<% } %>
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  <% if (filters.mongooseModels) { %>Thing.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %>Thing.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  <% if (filters.mongooseModels) { %>Thing.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %>Thing.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
