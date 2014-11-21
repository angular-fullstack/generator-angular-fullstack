/**
 * Collection of unit test helpers. (mostly related to Mocha syntax)
 * @module test/helpers
 */

'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var runAsync = require('run-async');
var assert = require('./assert');
var generators = require('../..');
var RunContext = require('../test/run-context');

exports.decorated = [];

/**
 * Create a function that will clean up the test directory,
 * cd into it, and create a dummy gruntfile inside. Intended for use
 * as a callback for the mocha `before` hook.
 *
 * @param {String} dir - path to the test directory
 * @returns {Function} mocha callback
 */

exports.setUpTestDirectory = function before(dir) {
  return function (done) {
    exports.testDirectory(dir, function () {
      exports.gruntfile({ dummy: true }, done);
    });
  };
};

/**
 * Create a function that will clean up the test directory,
 * cd into it, and create a dummy gruntfile inside. Intended for use
 * as a callback for the mocha `before` hook.
 *
 * @deprecated use helpers.setUpDirectory instead
 * @param {String} dir - path to the test directory
 * @returns {Function} mocha callback
 */

exports.before = function (dir) {
  console.log('before is deprecated. Use setUpTestDirectory instead');
  return exports.setUpTestDirectory(dir);
};

/**
 * Wrap a method with custom functionality.
 *
 * @param {Object} context - context to find the original method
 * @param {String} method  - name of the method to wrap
 * @param {Function} replacement - executes before the original method
 * @param {Object} options - config settings
 */

exports.decorate = function decorate(context, method, replacement, options) {
  options = options || {};
  replacement = replacement || function () {};

  var naturalMethod = context[method];

  exports.decorated.push({
    context: context,
    method: method,
    naturalMethod: naturalMethod
  });

  context[method] = function () {
    var rep = replacement.apply(context, arguments);

    if (!options.stub) {
      return naturalMethod.apply(context, arguments);
    }

    return rep;
  };
};

/**
 * Override a method with custom functionality.
 * @param {Object} context - context to find the original method
 * @param {String} method  - name of the method to wrap
 * @param {Function} replacement - executes before the original method
 */
exports.stub = function stub(context, method, replacement) {
  exports.decorate(context, method, replacement, { stub: true });
};

/**
 * Restore the original behavior of all decorated and stubbed methods
 */
exports.restore = function restore() {
  exports.decorated.forEach(function (dec) {
    dec.context[dec.method] = dec.naturalMethod;
  });
};

/**
 *
 * Generates a new Gruntfile.js in the current working directory based on
 * options hash passed in.
 *
 * @param {Object} options - Grunt configuration
 * @param {Function} done  - callback to call on completion
 * @example
 * before(helpers.gruntfile({
 *   foo: {
 *     bar: '<config.baz>'
 *   }
 * }));
 *
 */

exports.gruntfile = function (options, done) {
  var config = 'grunt.initConfig(' + JSON.stringify(options, null, 2) + ');';
  config = config.split('\n').map(function (line) {
    return '  ' + line;
  }).join('\n');

  var out = [
    'module.exports = function (grunt) {',
    config,
    '};'
  ];

  fs.writeFile('Gruntfile.js', out.join('\n'), done);
};

// Façade assert module for backward compatibility
exports.assertFile = assert.file;
exports.assertNoFile = assert.noFile;
exports.assertFiles = assert.files;
exports.assertFileContent = assert.fileContent;
exports.assertNoFileContent = assert.noFileContent;
exports.assertTextEqual = assert.textEqual;
exports.assertImplement = assert.implement;

/**
 * Clean-up the test directory and cd into it.
 * Call given callback after entering the test directory.
 * @param {String} dir - path to the test directory
 * @param {Function} cb - callback executed after setting working directory to dir
 * @example
 * testDirectory(path.join(__dirname, './temp'), function () {
 *   fs.writeFileSync('testfile', 'Roses are red.');
 * );
 */

exports.testDirectory = function (dir, cb) {
  if (!dir) {
    throw new Error('Missing directory');
  }

  dir = path.resolve(dir);

  // Make sure we're not deleting CWD by moving to top level folder. As we `cd` in the
  // test dir after cleaning up, this shouldn't be perceivable.
  process.chdir('/');

  rimraf(dir, function (err) {
    if (err) {
      return cb(err);
    }
    mkdirp.sync(dir);
    process.chdir(dir);
    cb();
  });
};

/**
 * Answer prompt questions for the passed-in generator
 * @param {Generator} generator - a Yeoman generator
 * @param {Object} answers - an object where keys are the
 *   generators prompt names and values are the answers to
 *   the prompt questions
 * @example
 * mockPrompt(angular, {'bootstrap': 'Y', 'compassBoostrap': 'Y'});
 */

exports.mockPrompt = function (generator, answers) {

  var origPrompt = generator.origPrompt || generator.prompt;
  answers = answers || {};
  generator.prompt = function (prompts, done) {
    if (!_.isArray(prompts)) {
      prompts = [prompts];
    }
    async.each(prompts, function (prompt, done) {
      var processDefault = function (after) {
        if (!(prompt.name in answers)) {
          if (_.isFunction(prompt.default)) {
            runAsync(prompt.default, function (val) {
              answers[prompt.name] = val;
              after();
            }, answers);
          } else {
            answers[prompt.name] = prompt.default;
            after();
          }
        } else {
          after();
        }
      };

      // Skip further processing (like `validate`) for prompts
      // that should not be executed
      var processWhen = function (after) {
        if (_.isFunction(prompt.when)) {
          runAsync(prompt.when, after, answers);
        } else {
          after(true);
        }
      };

      var processValidate = function (after) {
        if (_.isFunction(prompt.validate)) {
          runAsync(prompt.validate, function (validation) {
            if (validation !== true) {
              if (generator.prompt.errors == null) {
                generator.prompt.errors = [];
              }
              generator.prompt.errors.push({
                name: prompt.name,
                message: validation
              });
            }
            after();
          }, answers[prompt.name]);
        } else {
          after();
        }
      };

      processDefault(
        processWhen.bind(null, function (goOn) {
          if (!goOn) return done();
          processValidate(done.bind(null, null));
        }));
    }, function () {
      setTimeout(done.bind(null, answers), 0);
    });
  };
  generator.origPrompt = origPrompt;
};

/**
 * Create a simple, dummy generator
 */

exports.createDummyGenerator = function () {
  return generators.Base.extend({
    test: function () {
      this.shouldRun = true;
    }
  });
};

/**
 * Create a generator, using the given dependencies and controller arguments
 * Dependecies can be path (autodiscovery) or an array [<generator>, <name>]
 *
 * @param {String} name - the name of the generator
 * @param {Array} dependencies - paths to the generators dependencies
 * @param {Array|String} args - arguments to the generator;
 *   if String, will be split on spaces to create an Array
 * @param {Object} options - configuration for the generator
 * @example
 *  var deps = ['../../app',
 *              '../../common',
 *              '../../controller',
 *              '../../main',
 *              [createDummyGenerator(), 'testacular:app']
 *            ];
 * var angular = createGenerator('angular:app', deps);
 */

exports.createGenerator = function (name, dependencies, args, options) {
  var env = generators();

  this.registerDependencies(env, dependencies);

  var generator = env.create(name, { arguments: args, options: options });

  generator.on('start', env.emit.bind(this, 'generators:start'));
  generator.on('start', env.emit.bind(this, name + ':start'));

  generator.on('method', function (method) {
    env.emit(name + ':' + method);
  });

  generator.on('end', env.emit.bind(this, name + ':end'));
  generator.on('end', env.emit.bind(this, 'generators:end'));

  return generator;
};

/**
 * Register a list of dependent generators into the provided env.
 * Dependecies can be path (autodiscovery) or an array [<generator>, <name>]
 *
 * @param {Array} dependencies - paths to the generators dependencies
 */

exports.registerDependencies = function (env, dependencies) {
  dependencies.forEach(function (d) {
    if (_.isArray(d)) {
      env.registerStub(d[0], d[1]);
    } else {
      env.register(d);
    }
  });
};

/**
 * Run the provided Generator
 * @param  {String|Function} Generator - Generator constructor or namespace
 * @return {RunContext}
 */

exports.run = function (Generator) {
  return new RunContext(Generator);
};
