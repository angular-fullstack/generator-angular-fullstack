/**
 * Broadcast updates to client when the model changes
 */

'use strict';
<% if (filters.mongoose) { %>
var <%= classedName %> = require('./<%= name %>.model');<% } %><% if (filters.sequelize) { %>
var <%= classedName %> = require('../../sqldb').<%= classedName %>;<% } %>

exports.register = function(socket) {<% if (filters.sequelize) { %>
  <%= classedName %>.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });<% } %>
  <% if (filters.mongoose) { %><%= classedName %>.schema.post('save', function(doc) {<% }
     if (filters.sequelize) { %><%= classedName %>.hook('afterUpdate', function(doc, fields, fn) {<% } %>
    onSave(socket, doc);<% if (filters.sequelize) { %>
    fn(null);<% } %>
  });
  <% if (filters.mongoose) { %><%= classedName %>.schema.post('remove', function(doc) {<% }
     if (filters.sequelize) { %><%= classedName %>.hook('afterDestroy', function(doc, fields, fn) {<% } %>
    onRemove(socket, doc);<% if (filters.sequelize) { %>
    fn(null);<% } %>
  });
};

function onSave(socket, doc, cb) {
  socket.emit('<%= name %>:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('<%= name %>:remove', doc);
}
