###*
Using Rails-like standard naming convention for endpoints.
GET     /things              ->  index
POST    /things              ->  create
GET     /things/:id          ->  show
PUT     /things/:id          ->  update
DELETE  /things/:id          ->  destroy
###

'use strict'

_ = require 'lodash'<% if (filters.mongoose) { %>
Thing = require './thing.model'<% } %>

# Get list of things
exports.index = (req, res) -><% if (!filters.mongoose) { %>
  res.json [
    {
      name : 'Development Tools'
      info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
    }
    {
      name : 'Server and Client integration'
      info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    }
    {
      name : 'Smart Build System'
      info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    }
    {
      name : 'Modular Structure'
      info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
    }
    {
      name : 'Optimized Build'
      info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    }
    {
      name : 'Deployment Ready'
      info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    }
  ]<% } %><% if (filters.mongoose) { %>
  Thing.find (err, things) ->
    return handleError(res, err)  if err
    res.status(200).json things
  <% } %>
<% if (filters.mongoose) { %>

# Get a single thing
exports.show = (req, res) ->
  Thing.findById req.params.id, (err, thing) ->
    return handleError(res, err)  if err
    return res.status(404).end()  unless thing
    res.json thing

# Creates a new thing in the DB.
exports.create = (req, res) ->
  Thing.create req.body, (err, thing) ->
    return handleError(res, err)  if err
    res.status(201).json thing

# Updates an existing thing in the DB.
exports.update = (req, res) ->
  delete req.body._id  if req.body._id
  Thing.findById req.params.id, (err, thing) ->
    return handleError(res, err)  if err
    return res.status(404).end()  unless thing
    updated = _.merge(thing, req.body)
    updated.save (err) ->
      return handleError(res, err)  if err
      res.status(200).json thing

# Deletes a thing from the DB.
exports.destroy = (req, res) ->
  Thing.findById req.params.id, (err, thing) ->
    return handleError(res, err)  if err
    return res.status(404).end()  unless thing
    thing.remove (err) ->
      return handleError(res, err)  if err
      res.status(204).end()

handleError = (res, err) ->
  res.status(500).json err
<% } %>