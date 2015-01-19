###*
Broadcast updates to client when the model changes
###

'use strict'

<%= classedName %> = require './<%= name %>.model'

exports.register = (socket) ->
  <%= classedName %>.schema.post 'save', (doc) ->
    onSave socket, doc

  <%= classedName %>.schema.post 'remove', (doc) ->
    onRemove socket, doc

onSave = (socket, doc, cb) ->
  socket.emit '<%= name %>:save', doc

onRemove = (socket, doc, cb) ->
  socket.emit '<%= name %>:remove', doc
