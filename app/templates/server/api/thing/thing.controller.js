/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');<% if (filters.sql) { %>

function Thing(req){
  return req.app.get('models').Thing;
}<% } %>

// Get list of things
exports.index = function(req, res) {<% if (!filters.sql) { %>
  res.json([
  {
  name : 'Development Tools',
  info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
  name : 'Server and Client integration',
  info : 'Built with a powerful and fun stack: SQL(e.g. Postgres), Express, AngularJS, and Node.'
  }, {
  name : 'Smart Build System',
  info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
  name : 'Modular Structure',
  info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
  name : 'Optimized Build',
  info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
  name : 'Deployment Ready',
  info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  }
  ]);<% } %><% if (filters.sql) { %>
  Thing(req)
    .findAll()
    .then(function (things) {
      return res.status(200).json(things);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });<% } %>
};<% if (filters.sql) { %>

// Get a single thing
exports.show = function(req, res) {
  Thing(req)
    .findById(req.params.id)
    .then(function (thing) {
      if(!thing) { return res.status(404).send('Not Found'); }
      return res.json(thing);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing(req)
    .create(req.body)
    .then(function(thing) {
      return res.status(201).json(thing);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing(req)
    .findById(req.params.id)
    .then(function (thing) {
      if(!thing) { return res.status(404).send('Not Found'); }
      var updated = _.merge(thing, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(thing);
      });
    })
    .catch(function (err){
      if (err) { return handleError(res, err); }
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing(req)
    .findById(req.params.id)
    .then(function (thing) {
      if(!thing) { return res.status(404).send('Not Found'); }
      thing.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.status(204).send('No Content');
      });
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}<% } %>
