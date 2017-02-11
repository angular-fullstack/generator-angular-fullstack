/**
 * <%= classedName %> model events
 */

'use strict';

import {EventEmitter} from 'events';<% if(filters.sequelizeModels) { %>
var <%= classedName %> = require('<%= relativeRequire(config.get('registerModelsFile')) %>').<%= classedName %>;<% } %>
var <%= classedName %>Events = new EventEmitter();

// Set max event listeners (0 == unlimited)
<%= classedName %>Events.setMaxListeners(0);

// Model events
<%_ if(filters.mongooseModels) { -%>
var events = {
  save: 'save',
  remove: 'remove'
};
<%_ } if(filters.sequelizeModels) { -%>
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};
<%_ } -%>

// Register the event emitter to the model events
function registerEvents(<%= classedName %>) {
  for(var e in events) {
    let event = events[e];<% if(filters.mongooseModels) { %>
    <%= classedName %>.post(e, emitEvent(event));<% } if(filters.sequelizeModels) { %>
    <%= classedName %>.hook(e, emitEvent(event));<% } %>
  }
}

function emitEvent(event) {
  return function(doc<% if(filters.sequelizeModels) { %>, options, done<% } %>) {
    <%= classedName %>Events.emit(event + ':' + doc._id, doc);
    <%= classedName %>Events.emit(event, doc);<% if(filters.sequelizeModels) { %>
    done(null);<% } %>
  };
}
<% if (filters.sequelizeModels) { %>
registerEvents(<%= classedName %>);<% } if (filters.mongooseModels) { %>
export {registerEvents};<% } %>
export default <%= classedName %>Events;
