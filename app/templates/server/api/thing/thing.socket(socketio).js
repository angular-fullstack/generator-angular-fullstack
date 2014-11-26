/**
 * Broadcast updates to client when the model changes
 */

'use strict';
<% if (filters.mongooseModels) { %>
var thing = require('./thing.model');<% } %><% if (filters.sequelizeModels) { %>
var thing = require('../../sqldb').Thing;<% } %>

exports.register = function(socket) {<% if (filters.sequelizeModels) { %>
  thing.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });<% } %>
  <% if (filters.mongooseModels) { %>thing.schema.post('save', function(doc) {<% }
     if (filters.sequelizeModels) { %>thing.hook('afterUpdate', function(doc, fields, fn) {<% } %>
    onSave(socket, doc);<% if (filters.sequelizeModels) { %>
    fn(null);<% } %>
  });
  <% if (filters.mongooseModels) { %>thing.schema.post('remove', function(doc) {<% }
     if (filters.sequelizeModels) { %>thing.hook('afterDestroy', function(doc, fields, fn) {<% } %>
    onRemove(socket, doc);<% if (filters.sequelizeModels) { %>
    fn(null);<% } %>
  });
};

function onSave(socket, doc, cb) {
  socket.emit('thing:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('thing:remove', doc);
}
