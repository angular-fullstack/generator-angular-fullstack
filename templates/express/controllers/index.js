'use strict';

var path = require('path');

var tryPath = function(req, res, onPathNotFound) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      onPathNotFound(err, requestedView);
    } else {
      res.send(html);
    }
  });
};

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  tryPath(req, res, function(err, requestedView) {
    console.log("Error rendering partial '" + requestedView + "'\n", err);
    res.status(404);
    res.send(404);
  });
};

/**
 * Try and send the HTML page
 * If it doesn't exist, send the index page
 * This allows single page app in HTML5 history mode
 */
exports.index = function(req, res) {
  tryPath(req, res, function() {
    // The HTML file isn't on the server.
    // This is probably a HTML5 route in the Angular app,
    // so send the index file and let Angular take over.
    console.log('index taking over');
    res.render('index');
  });
};
