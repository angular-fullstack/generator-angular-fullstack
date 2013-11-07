'use strict';
<% if (!mongo) { %>
exports.awesomeThings = function(req, res) {
  res.json([
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma',
    'Express'
  ]);
};
<% } %><% if (mongo) { %>
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    async = require('async');

// Return a list of thing 'names' 
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      var thingNames = [];

      async.each(things, function (thing, cb) {
        thingNames.push(thing.name);
        cb();
      }, function (err) {
        return res.send(thingNames);
      });
    } else {
      return res.send(err);
    }
  });
};
<% } %>