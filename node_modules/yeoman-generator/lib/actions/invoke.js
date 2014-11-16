'use strict';

var GroupedQueue = require('grouped-queue');

// Local Environment#duplicate copy before to work with older yo versions.
// Delete once yo is updated and been out a while.
var duplicateEnvironment = function (initialEnv) {
  var queues = require('../env').queues;
  // Hack: create a clone of the environment with a new instance of runLoop
  var env = Object.create(initialEnv);
  env.runLoop = new GroupedQueue(queues);
  return env;
};

/**
 * Receives a `namespace`, and an Hash of `options` to invoke a given
 * generator. The usual list of arguments can be set with `options.args`
 * (ex. nopt's argv.remain array)
 *
 * DEPRECATION notice: As of version 0.17.0, `invoke()` should usually be
 * replaced by `composeWith()`.
 *
 * @param {String} namespace
 * @param {Object} options
 * @param {Function} cb
 *
 * @mixin
 * @alias actions/invoke
 */

module.exports = function invoke(namespace, options, cb) {
  cb = cb || function () {};
  options = options || {};
  options.args = options.args || [];

  // Hack: create a clone of the environment because we don't want to share
  // the runLoop
  var env = duplicateEnvironment(this.env);
  var generator = env.create(namespace, options);

  this.log.emit('up');
  this.log.invoke(namespace);
  this.log.emit('up');

  generator.on('end', this.log.emit.bind(this.log, 'down'));
  generator.on('end', this.log.emit.bind(this.log, 'down'));

  return generator.run(cb);
};
