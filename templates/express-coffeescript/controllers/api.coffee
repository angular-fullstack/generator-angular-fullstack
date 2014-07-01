'use strict'
<% if (mongo) { %>
mongoose = require 'mongoose'
Thing = mongoose.model 'Thing'
<% } %>
###
  Get awesome things
###
exports.awesomeThings = (req, res) -><% if (mongo) { %>
  Thing.find (err, things) ->
    return res.send(err) if err
    res.json things
  <% } %><% if (!mongo) { %>
  res.json [
    name : 'HTML5 Boilerplate'
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.'
    awesomeness: 10
  ,
    name : 'AngularJS'
    info : 'AngularJS is a toolset for building the framework most suited to your application development.'
    awesomeness: 10
  ,
    name : 'Karma'
    info : 'Spectacular Test Runner for JavaScript.'
    awesomeness: 10
  ,
    name : 'Express'
    info : 'Flexible and minimalist web application framework for node.js.'
    awesomeness: 10
  ]<% } %>
