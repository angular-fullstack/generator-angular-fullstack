'use strict';

var path = require('path');

exports.partials = function(req, res) {
  var requestedView = path.join('./', req.url);
  res.render(requestedView, function(err, html) {
    if(err) {
      res.render('404');
    } else {
      res.send(html);
    }
  });
};

exports.index = function(req, res) {
  res.render('index');
};
