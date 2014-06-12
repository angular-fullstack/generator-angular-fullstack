'use strict'

path = require 'path'

###
  Send partial, or 404 if it doesn't exist
###
exports.partials = (req, res) ->
  stripped = req.url.split('.')[0]
  requestedView = path.join './', stripped
  res.render requestedView, (err, html) ->
    if err
      console.log "Error rendering partial '#{requestedView}':\n", err
      return res.send 404

    res.send html

###
  Send our single page app
###
exports.index = (req, res) ->
  res.render 'index'
