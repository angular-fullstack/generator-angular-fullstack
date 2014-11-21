'use strict';
var _ = require('lodash');
var Base = require('../base');

/**
 * The Generator store
 * This is used to store generator (NPM modules) reference and instantiate them when
 * requested.
 * @constructor
 * @private
 */

var Store = module.exports = function Store () {
  this._generators = {};
  this._meta = {};
};

/**
 * Store a module under the namespace key
 * @param {String}          namespace - The key under which the generator can be retrieved
 * @param {String|Function} generator - A generator module or a module path
 */

Store.prototype.add = function add (namespace, generator) {
  if (_.isString(generator)) {
    this._storeAsPath(namespace, generator);
    return;
  }
  this._storeAsModule(namespace, generator);
};

Store.prototype._storeAsPath = function _storeAsPath (namespace, path) {
  this._meta[namespace] = {
    resolved: path,
    namespace: namespace
  };
  Object.defineProperty(this._generators, namespace, {
    get: function () {
      var Generator = require(path);
      return Generator;
    },
    enumerable: true,
    configurable: true
  });
};

Store.prototype._storeAsModule = function _storeAsModule (namespace, Generator) {
  this._meta[namespace] = {
    resolved: 'unknown',
    namespace: namespace
  };
  this._generators[namespace] = Generator;
};

/**
 * Get the module registered under the given namespace
 * @param  {String} namespace
 * @return {Module}
 */

Store.prototype.get = function get (namespace) {
  var Generator = this._generators[namespace];
  if (!Generator) return;
  return this.normalizeGenerator(namespace, Generator);
};

/**
 * Returns the list of registered namespace.
 * @return {Array} Namespaces array
 */

Store.prototype.namespaces = function namespaces () {
  return Object.keys(this._generators);
};

/**
 * Get the stored generators meta data
 * @return {Object} Generators metadata
 */

Store.prototype.getGeneratorsMeta = function getGeneratorsMeta () {
  return this._meta;
};

/**
 * Check if a Generator implement base Generator prototype.
 * @param  {Generator|Function}  generator
 * @private
 * @return {Boolean}
 */

function isRaw(Generator) {
  Generator = Object.getPrototypeOf(Generator.prototype);
  var methods = ['option', 'argument', 'hookFor', 'run'];
  return methods.filter(function (method) {
    return !!Generator[method];
  }).length !== methods.length;
}

/**
 * Normalize a Generator, extending it with related metadata and allowing simple
 * function to be registered as generators
 * @param  {Generator} Generator
 * @return {Generator}
 */

Store.prototype.normalizeGenerator = function normalizeGenerator (namespace, Generator) {
  if (isRaw(Generator)) {
    Generator = Base.extend({ exec: Generator });
  }
  _.extend(Generator, this._meta[namespace]);
  return Generator;
};
