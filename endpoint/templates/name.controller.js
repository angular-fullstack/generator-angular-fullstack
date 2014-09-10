'use strict';

var _ = require('lodash');<% if (filters.mongoose) { %>
var <%= classedName %> = require('./<%= name %>.model');<% } %>

// Get list of <%= name %>s
exports.index = function(req, res) {<% if (!filters.mongoose) { %>
  res.json([]);<% } %><% if (filters.mongoose) { %>
  <%= classedName %>.find(function (err, <%= cameledName %>s) {
    if(err) { return handleError(res, err); }
    return res.json(200, <%= cameledName %>s);
  });<% } %>
};<% if (filters.mongoose) { %>

// Get a single <%= name %>
exports.show = function(req, res) {
  <%= classedName %>.findById(req.params.id, function (err, <%= cameledName %>) {
    if(err) { return handleError(res, err); }
    if(!<%= cameledName %>) { return res.send(404); }
    return res.json(<%= cameledName %>);
  });
};

// Creates a new <%= name %> in the DB.
exports.create = function(req, res) {
  <%= classedName %>.create(req.body, function(err, <%= cameledName %>) {
    if(err) { return handleError(res, err); }
    return res.json(201, <%= cameledName %>);
  });
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  <%= classedName %>.findById(req.params.id, function (err, <%= cameledName %>) {
    if (err) { return handleError(res, err); }
    if(!<%= cameledName %>) { return res.send(404); }
    var updated = _.merge(<%= cameledName %>, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, <%= cameledName %>);
    });
  });
};

// Deletes a <%= name %> from the DB.
exports.destroy = function(req, res) {
  <%= classedName %>.findById(req.params.id, function (err, <%= cameledName %>) {
    if(err) { return handleError(res, err); }
    if(!<%= cameledName %>) { return res.send(404); }
    <%= cameledName %>.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}<% } %>
