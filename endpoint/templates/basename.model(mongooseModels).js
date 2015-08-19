'use strict';

var mongoose = require('mongoose-bird')();
var Schema = mongoose.Schema;

var <%= classedName %>Schema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('<%= classedName %>', <%= classedName %>Schema);
