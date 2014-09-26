'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var <%= classedName %>Schema = new Schema({
  <% if(authenticated) { %>user: [ {type: Schema.Types.ObjectId, ref: 'user'} ],<% } %>
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('<%= classedName %>', <%= classedName %>Schema);
