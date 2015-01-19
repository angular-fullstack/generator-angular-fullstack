'use strict'

mongoose = require 'mongoose'
Schema = mongoose.Schema

<%= classedName %>Schema = new Schema
  name: String
  info: String
  active: Boolean

module.exports = mongoose.model '<%= classedName %>', <%= classedName %>Schema