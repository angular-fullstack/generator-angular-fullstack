'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Tree = require('ast-query');

/**
 * A class managing the edition of the project Gruntfile content. Editing the
 * Gruntfile using this class allow easier Generator composability as they can
 * work and add parts to the same Gruntfile without having to parse the
 * Gruntfile AST themselves.
 * @constructor
 * @param  {String} gruntfileContent - The actual `Gruntfile.js` content
 */

var GruntfileEditor = module.exports = function (gruntfileContent) {
  gruntfileContent = gruntfileContent ||
    fs.readFileSync(path.join(__dirname, 'default-gruntfile.js'));
  this.gruntfile = new Tree(gruntfileContent.toString());
};

/**
 * Insert a configuration section inside the `Gruntfile.js` initConfig() block
 * @param  {String} name   - Key name of the configuration block
 * @param  {String} config - Configuration content code as a string.
 * @return {this}
 */

GruntfileEditor.prototype.insertConfig = function (name, config) {
  name = _.isString(name) && name.trim() || false;
  config = _.isString(config) && config.trim() || false;
  assert(name, 'You must provide a task name');
  assert(config, 'You must provide a task configuration body as a String');
  this.gruntfile.callExpression('grunt.initConfig').arguments.at(0)
    .key(name).value(config);
  return this;
};

/**
 * Load a Grunt plugin
 * @param {String} pluginName - name of the plugin to load (ex: 'grunt-sass')
 * @return {this}
 */

GruntfileEditor.prototype.loadNpmTasks = function (pluginName) {
  pluginName = _.isString(pluginName) && pluginName.trim() || false;
  assert(pluginName, 'You must provide a plugin name');
  this.gruntfile.assignment('module.exports').value().body.prepend(
    'grunt.loadNpmTasks("' + pluginName + '");'
  );
  return this;
};

/**
 * Register a task inside a named task group
 *
 * Can optionally take an object to specify options:
 *  * duplicates (false): Allow the same task to be inserted multiple times
 *
 * @param {String} name  - Task group name
 * @param {String|Array[String]} tasks - Tasks name to insert in the group
 * @param {Object} options - An optional object to specify options
 * @return {this}
 */

GruntfileEditor.prototype.registerTask = function (name, tasks, options) {
  name = _.isString(name) && name.trim() ? name : false;
  assert(name, 'You must provide a task group name');

  if (_.isString(tasks)) {
    tasks = tasks.trim() || false;
  }
  if (_.isArray(tasks)) {
    tasks = tasks.length > 0 && tasks || false;
  }
  if (!(_.isString(tasks) || _.isArray(tasks))) {
    tasks = false;
  }
  assert(tasks, 'You must provide a task or an array of tasks');

  if (options != null && !_.isPlainObject(options)) {
    assert(false, 'If you provide options, they must be as an Object');
  }

  options = _.merge({
    duplicates: false
  }, options);

  var current = this.gruntfile.callExpression('grunt.registerTask')
    .filter(function (node) {
      return node.arguments[0].value === name;
    });
  tasks = _.isArray(tasks) ? tasks : tasks.replace(/ /g, '').split(',');

  if (!current.length) {
    this.gruntfile.assignment('module.exports').value().body.append(
      'grunt.registerTask("' + name + '", ["' + tasks.join('","') + '"])'
    );
  }
  else {
    var argList = current.arguments.at(1);
    var currentTasks = argList.nodes[0].map(function (list) {
      return list.value;
    });

    tasks.forEach(function (task) {
      if (currentTasks.indexOf(task) === -1 || options.duplicates) {
        argList.push('"' + task + '"');
      }
    });
  }

  return this;
};

/**
 * Add a variable declaration to the Gruntfile
 * @param {String} name  - Variable name
 * @param {String} value - Variable value
 *
 * @return {this}
 */

GruntfileEditor.prototype.insertVariable = function (name, value) {
  name = _.isString(name) && name.trim() || false;
  assert(name, 'You must provide a variable name');
  value = _.isString(value) && value.trim() || false;
  assert(value, 'You must provide a variable value as a String');

  var current = this.gruntfile.var(name);
  if (current.length) {
    current.value(value);
  } else {
    this.gruntfile.assignment('module.exports').value().body
      .prepend('var ' + name + ' = ' + value);
  }
  return this;
};

/**
 * Return the Gruntfile representation as a string suitable for writing to an
 * actual `Gruntfile.js`
 * @return {String} gruntfileContent - The actual `Gruntfile.js` content
 */

GruntfileEditor.prototype.toString = function () {
  return this.gruntfile.toString();
};
