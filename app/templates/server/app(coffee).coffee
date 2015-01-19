###*
Main application file
###
'use strict'

# Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV or 'development'

express = require 'express'<% if (filters.mongoose) { %>
mongoose = require 'mongoose'<% } %>
config = require './config/environment'
<% if (filters.mongoose) { %>
# Connect to database
mongoose.connect config.mongo.uri, config.mongo.options

# Populate DB with sample data
require './config/seed'  if config.seedDB

<% } %># Setup server
app = express()
server = require('http').createServer(app)<% if (filters.socketio) { %>
socketio = require('socket.io')(server,
  serveClient: (if (config.env is 'production') then false else true)
  path: '/socket.io-client'
)
require('./config/socketio') socketio<% } %>
require('./config/express') app
require('./routes') app

# Start server
server.listen config.port, config.ip, ->
  console.log 'Express server listening on %d, in %s mode', config.port, app.get('env')

# Expose app
exports = module.exports = app
