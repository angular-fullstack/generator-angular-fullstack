/**
 * User model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;<% if (filters.mongooseModels) { %>
var User = require('./user.model');<% } if (filters.sequelizeModels) { %>
var User = require('../../sqldb').User;<% } %>
var UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

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
  User.schema.post(e, emitEvent(event));<% } if (filters.sequelizeModels) { %>
  User.hook(e, emitEvent(event));<% } %>
}

function emitEvent(event) {
  return function(doc<% if (filters.sequelizeModels) { %>, options, done<% } %>) {
    UserEvents.emit(event + ':' + doc._id, doc);
    UserEvents.emit(event, doc);<% if (filters.sequelizeModels) { %>
    done(null);<% } %>
  }
}

module.exports = UserEvents;
