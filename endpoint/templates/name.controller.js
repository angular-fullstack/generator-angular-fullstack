'use strict';

var _ = require('lodash');<% if (filters.sql) { %>

function <%= classedName %>(req){
  return req.app.get('models').<%= classedName %>;
}<% } %>

// Get list of <%= name %>s
exports.index = function(req, res) {<% if (!filters.sql) { %>
  res.json([]);<% } %><% if (filters.sql) { %>
  <%= classedName %>(req)
    .findAll()
    .then(function (<%= name %>s) {
      return res.status(200).json(<%= name %>s);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });<% } %>
};<% if (filters.sql) { %>

// Get a single <%= name %>
exports.show = function(req, res) {
  <%= classedName %>
    .findById(req.params.id)
    .then(function (<%= name %>) {
      if(!<%= name %>) { return res.status(404).send('Not Found'); }
      return res.json(<%= name %>);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Creates a new <%= name %> in the DB.
exports.create = function(req, res) {
  <%= classedName %>
    .create(req.body)
    .then(function (<%= name %>) {
      return res.status(201).json(<%= name %>);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  <%= classedName %>
    .findById(req.params.id)
    .then(function (<%= name %>) {
      if(!<%= name %>) { return res.status(404).send('Not Found'); }
      var updated = _.merge(<%= name %>, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(<%= name %>);
      });
    })
    .catch(function (err){
      if (err) { return handleError(res, err); }
    });
};

// Deletes a <%= name %> from the DB.
exports.destroy = function(req, res) {
  <%= classedName %>
    .findById(req.params.id)
    .then(function (<%= name %>) {
      if(!<%= name %>) { return res.status(404).send('Not Found'); }
      <%= name %>.destroy(function(err) {
        if(err) { return handleError(res, err); }
        return res.status(204).send('No Content');
      });
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}<% } %>
