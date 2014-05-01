// Using Rails-like standard naming convention for endpoints.
// GET     /things              ->  index
// POST    /things              ->  create
// GET     /things/:id          ->  show
// PUT     /things/:id          ->  update
// DELETE  /things/:id          ->  destroy

'use strict';

var Thing = require('./thing.model');

var handleError = function(res, err) {
  return res.send(500, err);
};

/**
 * Get list of things
 */
exports.index = function(req, res) {
  return Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

/**
 * Get a single thing
 */
exports.show = function(req, res) {
  return Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

/**
 * Creates a new thing in the DB.
 */
exports.create = function(req, res) {
  return Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

/**
 * Updates an existing thing in the DB.
 */
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; } // Prevent mongo 'Mod on _id not allowed' error
  Thing.findByIdAndUpdate(req.params.id, req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(200, thing);
  });
};

/**
 * Deletes a thing from the DB.
 */
exports.destroy = function(req, res) {
  Thing.findByIdAndRemove(req.params.id, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.send(204);
  });
};