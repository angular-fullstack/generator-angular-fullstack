/**
 * <%= classedName %> model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;<% if (filters.mongooseModels) { %>
var <%= classedName %> = require('./<%= basename %>.model');<% } if (filters.sequelizeModels) { %>
var <%= classedName %> = require('<%= relativeRequire(config.get('registerModelsFile')) %>').<%= classedName %>;<% } %>
var <%= classedName %>Events = new EventEmitter();

// Set max event listeners (0 == unlimited)
<%= classedName %>Events.setMaxListeners(0);

// Model events<% if (filters.mongooseModels) { %>
var events = {
  'save': 'save',
  'remove': 'remove'
};<% } if (filters.sequelizeModels) { %>
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};<% } %>

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];<% if (filters.mongooseModels) { %>
  <%= classedName %>.schema.post(e, emitEvent(event));<% } if (filters.sequelizeModels) { %>
  <%= classedName %>.hook(e, emitEvent(event));<% } %>
}

function emitEvent(event) {
  return function(doc<% if (filters.sequelizeModels) { %>, options, done<% } %>) {
    <%= classedName %>Events.emit(event + ':' + doc._id, doc);
    <%= classedName %>Events.emit(event, doc);<% if (filters.sequelizeModels) { %>
    done(null);<% } %>
  }
}

module.exports = <%= classedName %>Events;
