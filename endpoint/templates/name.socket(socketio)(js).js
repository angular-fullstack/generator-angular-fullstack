/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var <%= classedName %> = require('./<%= name %>.model');

exports.register = function(socket) {
  <%= classedName %>.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  <%= classedName %>.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('<%= name %>:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('<%= name %>:remove', doc);
}