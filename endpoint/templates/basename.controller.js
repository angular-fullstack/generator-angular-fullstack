/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     <%= route %>              ->  index<% if (filters.models) { %>
 * POST    <%= route %>              ->  create
 * GET     <%= route %>/:id          ->  show
 * PUT     <%= route %>/:id          ->  update
 * DELETE  <%= route %>/:id          ->  destroy<% } %>
 */

'use strict';<% if (filters.models) { %>

var _ = require('lodash');<% if (filters.mongooseModels) { %>
var <%= classedName %> = require('./<%= basename %>.model');<% } if (filters.sequelizeModels) { %>
var sqldb = require('<%= relativeRequire(config.get('registerModelsFile')) %>');
var <%= classedName %> = sqldb.<%= classedName %>;<% } %>

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
      res.status(statusCode).json(entity);
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
          res.status(204).end();
        });
    }
  };
}<% } %>

// Gets a list of <%= classedName %>s
exports.index = function(req, res) {<% if (!filters.models) { %>
  res.json([]);<% } else { %>
  <% if (filters.mongooseModels) { %><%= classedName %>.findAsync()<% }
     if (filters.sequelizeModels) { %><%= classedName %>.findAll()<% } %>
    .then(responseWithResult(res))
    .catch(handleError(res));<% } %>
};<% if (filters.models) { %>

// Gets a single <%= classedName %> from the DB
exports.show = function(req, res) {
  <% if (filters.mongooseModels) { %><%= classedName %>.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %><%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new <%= classedName %> in the DB
exports.create = function(req, res) {
  <% if (filters.mongooseModels) { %><%= classedName %>.createAsync(req.body)<% }
     if (filters.sequelizeModels) { %><%= classedName %>.create(req.body)<% } %>
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing <%= classedName %> in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  <% if (filters.mongooseModels) { %><%= classedName %>.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %><%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a <%= classedName %> from the DB
exports.destroy = function(req, res) {
  <% if (filters.mongooseModels) { %><%= classedName %>.findByIdAsync(req.params.id)<% }
     if (filters.sequelizeModels) { %><%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};<% } %>
