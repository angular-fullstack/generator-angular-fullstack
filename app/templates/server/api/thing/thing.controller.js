/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';<% if (filters.mongoose) { %>

var _ = require('lodash');
var Thing = require('./thing.model');

function handleError(res, statusCode){
  statusCode = statusCode || 500;
  return function(err){
    res.send(statusCode, err);
  };
}

function responseWithResult(res, statusCode){
  statusCode = statusCode || 200;
  return function(entity){
    if(entity){
      return res.json(statusCode, entity);
    }
  };
}

function handleEntityNotFound(res){
  return function(entity){
    if(!entity){
      res.send(404);
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates){
  return function(entity){
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .then(function () {
        return updated;
      });
  };
}

function removeEntity(res){
  return function (entity) {
    if(entity){
      return entity.removeAsync()
        .then(function() {
          return res.send(204);
        });
    }
  };
}<% } %>

// Get list of things
exports.index = function(req, res) {<% if (!filters.mongoose) { %>
  res.json([
  {
  name : 'Development Tools',
  info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
  name : 'Server and Client integration',
  info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
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
  ]);<% } if (filters.mongoose) { %>
  Thing.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));<% } %>
};<% if (filters.mongoose) { %>

// Get a single thing
exports.show = function(req, res) {
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};<% } %>
