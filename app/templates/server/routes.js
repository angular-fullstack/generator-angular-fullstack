/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var fs = require('fs');

module.exports = function(app) {

  var v1 = require('express').Router();
  app.use('/api/v1', v1);

  //Find all the routes that are defined in the api folder
  var apiPath = path.resolve(__dirname, 'api');
  fs.readdir(apiPath, function(err, routeDirs) {
    if(err) { throw 'Error getting routes: ' + err; }

    if(routeDirs && routeDirs.length) {
      routeDirs.forEach(function(routeDir) {
        var routeDef = require(path.resolve(apiPath, routeDir));
        if(routeDef && routeDef.path && routeDef.router) {
          v1.use('/' + routeDef.path, routeDef.router);
        }
      });
    }<% if(filters.auth) { %>

    app.use('/auth', require(path.resolve(__dirname, 'auth')));<% } %>

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
      .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
      .get(function(req, res) {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      });
  })
};
