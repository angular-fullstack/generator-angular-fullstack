/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var <%= name %> = require('./<%= name %>.model');

exports.register = function(socket) {
  <%= name %>.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  <%= name %>.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('<%= name %>:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('<%= name %>:remove', doc);
}