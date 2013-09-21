'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.appTemplate('filter', 'scripts/filters/' + this.name);
  this.testTemplate('spec/filter', 'filters/' + this.name);
  this.addScriptToIndex('filters/' + this.name);
};
