'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var util = require('util');

function readJSON(path) {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  return {};
}

/**
 * Storage instances handle a json file where Generator authors can store data.
 *
 * `Base` instantiate the storage as `config` by default.
 *
 * @constructor
 * @param  {String} name       The name of the new storage (this is a namespace)
 * @param  {String} configPath The filepath used as a storage. `.yo-rc.json` is used
 *                             by default
 *
 * @example
 * var MyGenerator = yeoman.generators.base.extend({
 *   config: function() {
 *     this.config.set('coffeescript', false);
 *   }
 * });
 */

var Storage = module.exports = function Storage(name, configPath) {
  EventEmitter.call(this);

  assert(name, 'A name parameter is required to create a storage');

  this.path = configPath || path.join(process.cwd(), '.yo-rc.json');
  this.name = name;
  this.pending = false;

  this._throttledSave = _.debounce(_.bind(this.forceSave, this), 5);

  this._store = readJSON(this.path)[this.name] || {};
  this.existed = Object.keys(this._store).length > 0;
};
util.inherits(Storage, EventEmitter);

/**
 * Schedule a save to happen sometime on a future tick.
 * Note: This method is actually defined at runtime in the constructor function.
 * @return {null}
 */

Storage.prototype.save = function () {
  this.pending = true;
  this._throttledSave();
};

/**
 * Force save (synchronously write the store to disk).
 * @return {null}
 */

Storage.prototype.forceSave = function () {
  var fullStore = readJSON(this.path);
  fullStore[this.name] = this._store;
  fs.writeFileSync(this.path, JSON.stringify(fullStore, null, '  '));
  this.pending = false;
  this.emit('save');
};

/**
 * Get a stored value
 * @param  {String} key  The key under which the value is stored.
 * @return {*}           The stored value. Any JSON valid type could be returned
 */

Storage.prototype.get = function (key) {
  return this._store[key];
};

/**
 * Get all the stored values
 * @return {Object}  key-value object
 */

Storage.prototype.getAll = function () {
  return _.cloneDeep(this._store);
};

/**
 * Assign a key to a value and schedule a save.
 * @param {String} key  The key under which the value is stored
 * @param {*} val  Any valid JSON type value (String, Number, Array, Object).
 * @return {*} val  Whatever was passed in as val.
 */

Storage.prototype.set = function (key, val) {
  assert(!_.isFunction(val), 'Storage value can\'t be a function');

  if (_.isObject(key)) {
    val = _.extend(this._store, key);
  } else {
    this._store[key] = val;
  }
  this.save();
  return val;
};

/**
 * Delete a key from the store and schedule a save.
 * @param  {String} key  The key under which the value is stored.
 * @return {null}
 */

Storage.prototype.delete = function (key) {
  delete this._store[key];
  this.save();
};

/**
 * Setup the store with defaults value and schedule a save.
 * If keys already exist, the initial value is kept.
 * @param  {Object} defaults  Key-value object to store.
 * @return {*} val  Returns the merged options.
 */

Storage.prototype.defaults = function (defaults) {
  assert(_.isObject(defaults), 'Storage `defaults` method only accept objects');
  var val = _.defaults(this.getAll(), defaults);
  this.set(val);
  return val;
};
