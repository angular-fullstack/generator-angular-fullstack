'use strict';
var path = require('path');
var assert = require('assert');
var _ = require('lodash');
var yeoman = require('../..');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var helpers = require('./helpers');

/**
 * This class provide a run context object to façade the complexity involved in setting
 * up a generator for testing
 * @constructor
 * @param  {String|Function} Generator - Namespace or generator constructor. If the later
 *                                       is provided, then namespace is assumed to be
 *                                       'gen:test' in all cases
 * @return {this}
 */

var RunContext = module.exports = function RunContext(Generator) {
  this._asyncHolds = 0;
  this.runned = false;
  this.args = [];
  this.options = {};
  this._dependencies = [];
  this.Generator = Generator;

  setTimeout(this._run.bind(this), 10);
};

util.inherits(RunContext, EventEmitter);

/**
 * Hold the execution until the returned callback is triggered
 * @return {Function} Callback to notify the normal execution can resume
 */

RunContext.prototype.async = function () {
  this._asyncHolds++;
  return function () {
    this._asyncHolds--;
    this._run();
  }.bind(this);
};

/**
 * Method called when the context is ready to run the generator
 * @private
 */

RunContext.prototype._run = function () {
  if (this._asyncHolds !== 0 || this.runned) return;
  this.runned = true;

  var namespace;
  this.env = yeoman();

  helpers.registerDependencies(this.env, this._dependencies);

  if (_.isString(this.Generator)) {
    namespace = this.env.namespace(this.Generator);
    this.env.register(this.Generator);
  } else {
    namespace = 'gen:test';
    this.env.registerStub(this.Generator, namespace);
  }

  this.generator = this.env.create(namespace, {
    arguments: this.args,
    options: _.extend({
      'skip-install': true
    }, this.options)
  });
  helpers.mockPrompt(this.generator, this._answers);

  this.generator.once('end', this.emit.bind(this, 'end'));
  this.emit('ready', this.generator);
  this.generator.run();
};

/**
 * Clean the provided directory, then change directory into it
 * @param  {String} dirPath - Directory path (relative to CWD). Prefer passing an absolute
 *                            file path for predictable results
 * @return {this}
 */

RunContext.prototype.inDir = function (dirPath, cb) {
  var release = this.async();
  var callBackThenRelease = _.compose(release, (cb || _.noop).bind(this, path.resolve(dirPath)));
  helpers.testDirectory(dirPath, callBackThenRelease);
  return this;
};

/**
 * Provide arguments to the run context
 * @param  {String|Array} args - command line arguments as Array or space separated string
 * @return {this}
 */

RunContext.prototype.withArguments = function (args) {
  var argsArray =  _.isString(args) ? args.split(' ') : args;
  assert(_.isArray(argsArray), 'args should be either a string separated by spaces or an array');
  this.args = this.args.concat(argsArray);
  return this;
};

/**
 * Provide options to the run context
 * @param  {Object} options - command line options (e.g. `--opt-one=foo`)
 * @return {this}
 */

RunContext.prototype.withOptions = function (options) {
  this.options = _.extend(this.options, options);
  return this;
};

/**
 * Mock the prompt with dummy answers
 * @param  {Object} answers - Answers to the prompt questions
 * @return {this}
 */

RunContext.prototype.withPrompts = function (answers) {
  this._answers = _.extend(this._answers || {}, answers);
  return this;
};

/**
 * @alias RunContext.prototype.withPrompts
 * @deprecated
 */

RunContext.prototype.withPrompt = RunContext.prototype.withPrompts;

/**
 * Provide dependent generators
 * @param {Array} dependencies - paths to the generators dependencies
 * @return {this}
 * @example
 *  var deps = ['../../common',
 *              '../../controller',
 *              '../../main',
 *              [helpers.createDummyGenerator(), 'testacular:app']
 *            ];
 * var angular = new RunContext('../../app');
 * angular.withGenerator(deps);
 * angular.withPrompt({
 *   compass: true,
 *   bootstrap: true
 * });
 * angular.onEnd(function () {
 *   // assert something
 * });
 */

RunContext.prototype.withGenerators = function (dependencies) {
  assert(_.isArray(dependencies), 'dependencies should be an array');
  this._dependencies = this._dependencies.concat(dependencies);
  return this;
};

/**
 * Add a callback to be called after the generator has ran
 * @deprecated `onEnd` is deprecated, use .on('end', onEndHandler) instead.
 * @param  {Function} callback
 * @return {this}
 */

RunContext.prototype.onEnd = function (cb) {
  console.log('`onEnd` is deprecated, use .on(\'end\', onEndHandler) instead.');
  return this.on('end', cb);
};
