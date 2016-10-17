/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     <%= route %>              ->  index<% if(filters.models) { %>
 * POST    <%= route %>              ->  create
 * GET     <%= route %>/:id          ->  show
 * PUT     <%= route %>/:id          ->  upsert
 * PATCH   <%= route %>/:id          ->  patch
 * DELETE  <%= route %>/:id          ->  destroy<% } %>
 */

'use strict';<% if(filters.models) { %>

import jsonpatch from 'fast-json-patch';<% if(filters.mongooseModels) { %>
import <%= classedName %> from './<%= basename %>.model';<% } if(filters.sequelizeModels) { %>
import {<%= classedName %>} from '<%= relativeRequire(config.get('registerModelsFile')) %>';<% } %>

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      <% if(filters.mongooseModels) { %>return entity.remove()<% }
         if(filters.sequelizeModels) { %>return entity.destroy()<% } %>
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}<% } %>

// Gets a list of <%= classedName %>s
export function index(req, res) {<% if(!filters.models) { %>
  res.json([]);<% } else { %>
  <% if(filters.mongooseModels) { %>return <%= classedName %>.find().exec()<% }
     if(filters.sequelizeModels) { %>return <%= classedName %>.findAll()<% } %>
    .then(respondWithResult(res))
    .catch(handleError(res));<% } %>
}<% if(filters.models) { %>

// Gets a single <%= classedName %> from the DB
export function show(req, res) {
  <% if(filters.mongooseModels) { %>return <%= classedName %>.findById(req.params.id).exec()<% }
     if(filters.sequelizeModels) { %>return <%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new <%= classedName %> in the DB
export function create(req, res) {
  <% if(filters.mongooseModels) { %>return <%= classedName %>.create(req.body)<% }
     if(filters.sequelizeModels) { %>return <%= classedName %>.create(req.body)<% } %>
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given <%= classedName %> in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  <%_ if(filters.mongooseModels) { -%>
  return <%= classedName %>.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()<% } %>
  <%_ if(filters.sequelizeModels) { -%>
  return <%= classedName %>.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing <%= classedName %> in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  <% if(filters.mongooseModels) { %>return <%= classedName %>.findById(req.params.id).exec()<% }
     if(filters.sequelizeModels) { %>return <%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a <%= classedName %> from the DB
export function destroy(req, res) {
  <% if(filters.mongooseModels) { %>return <%= classedName %>.findById(req.params.id).exec()<% }
     if(filters.sequelizeModels) { %>return <%= classedName %>.find({
    where: {
      _id: req.params.id
    }
  })<% } %>
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}<% } %>
