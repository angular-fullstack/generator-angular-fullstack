use strict'

_ = require 'lodash'<% if (filters.mongoose) { %>
<%= classedName %> = require './<%= name %>.model'<% } %>

# Get list of <%= name %>s
exports.index = (req, res) -><% if (!filters.mongoose) { %>
  res.json []<% } %><% if (filters.mongoose) { %>
  <%= classedName %>.find (err, <%= name %>s) ->
    return handleError res, err  if err
    (res.status 200).json <%= name %>s
  <% } %>
<% if (filters.mongoose) { %>

# Get a single <%= name %>
exports.show = (req, res) ->
  <%= classedName %>.findById req.params.id, (err, <%= name %>) ->
    return handleError res, err  if err
    return (res.status 404).send 'Not Found'  if not <%= name %>
    res.json <%= name %>

# Creates a new <%= name %> in the DB.
exports.create = (req, res) ->
  <%= classedName %>.create req.body, (err, <%= name %>) ->
    return handleError res, err  if err
    (res.status 201).json <%= name %>

# Updates an existing <%= name %> in the DB.
exports.update = (req, res) ->
  delete req.body._id  if req.body._id
  <%= classedName %>.findById req.params.id, (err, <%= name %>) ->
    return handleError res, err  if err
    return (res.status 404).send 'Not Found'  if not <%= name %>
    updated = _.merge <%= name %>, req.body
    updated.save (err) ->
      return handleError res, err  if err
      (res.status 200).json <%= name %>

# Deletes a <%= name %> from the DB.
exports.destroy = (req, res) ->
  <%= classedName %>.findById req.params.id, (err, <%= name %>) ->
    return handleError res, err  if err
    return (res.status 404).send 'Not Found'  if not <%= name %>
    <%= name %>.remove (err) ->
      return handleError res, err  if err
      (res.status 204).send 'No Content'

handleError = (res, err) ->
  (res.status 500).send err
<% } %>
