'use strict'

express = require 'express'<% if (mongo) { %>
path = require 'path'
fs = require 'fs'
mongoose = require 'mongoose'<% } %>

###
  Main application file
###

# Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV ? 'development'

config = require './lib/config/config'<% if (mongo) { %>
db = mongoose.connect config.mongo.uri, config.mongo.options

# Bootstrap models
modelsPath = path.join __dirname, 'lib/models'
fs.readdirSync(modelsPath).forEach (file) ->
  if /(.*)\.(js$|coffee$)/.test file
    require modelsPath + '/' + file

# Populate empty DB with sample data
require './lib/config/dummydata'<% } %><% if(mongoPassportUser) { %>

# Passport Configuration
passport = require './lib/config/passport'<% } %>

# Setup Express
app = express()
require('./lib/config/express') app
require('./lib/routes') app

# Start server
app.listen config.port, config.ip, ->
  console.log 'Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env')

# Expose app
exports = module.exports = app
