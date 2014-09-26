'use strict';

var _ = require('lodash');<% if (filters.mongoose) { %>
var <%= classedName %> = require('./<%= name %>.model');<% } %>

// Get list of <%= name %>s
exports.index = function(req, res) {<% if (!filters.mongoose) { %>
  res.json([]);<% } %><% if (filters.mongoose) { %>
  <%= classedName %>.find(req.query, function (err, <%= name %>s) {
    if(err) { return handleError(res, err); }
    return res.json(200, <%= name %>s);
  });<% } %>
};<% if (filters.mongoose) { %>

// Get a single <%= name %>
exports.show = function(req, res) {
  <%= classedName %>.findById(req.params.id, function (err, <%= name %>) {
    if(err) { return handleError(res, err); }
    if(!<%= name %>) { return res.send(404); }
    return res.json(<%= name %>);
  });
};

// Creates a new <%= name %> in the DB.
exports.create = function(req, res) {
  <%= classedName %>.create(req.body, function(err, <%= name %>) {
    if(err) { return handleError(res, err); }
    return res.json(201, <%= name %>);
  });
};

// Sets the sent <%= name %> as available at :id
exports.replace = function(req, res) {
  if(!req.params.id) { return res.send(404); }
  req.body._id = req.params.id;
<% if(authenticated) { %>
  <%= classedName %>.findAndUpdate(_.merge({_id: req.params.id}, req.query), req.body, {upsert: true}, function(err, <%= name %>) {<% } else { %>
  <%= classedName %>.findByIdAndUpdate(req.params.id, req.body, {upsert: true}, function(err, <%= name %>) {<% } %>
    if(err) { return handleError(res, err); }
    if(!<%= name %>) { return res.send(500); }

    return res.json(200, <%= name %>);
  });
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
<% if(authenticated) { %>
  <%= classedName %>.findAndUpdate(_.merge({_id: req.params.id}, req.query), {$set: req.body}, function(err, <%= name %>) {
<% } else { %>
  <%= classedName %>.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, <%= name %>) {
<% } %>
    if (err) { return handleError(res, err); }
    if(!<%= name %>) { return res.send(404); }
    return res.json(200, <%= name %>);
  });
};

// Deletes a <%= name %> from the DB.
exports.destroy = function(req, res) {
<% if(authenticated) { %>
  <%= classedName %>.find(_.merge({_id: req.params.id}, req.query), function(err, <%= name %>) {
<% } else { %>
  <%= classedName %>.findById(req.params.id, function (err, <%= name %>) {
<% } %>
    if(err) { return handleError(res, err); }
    if(!<%= name %>) { return res.send(404); }

    <%= name %>.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}<% } %>
