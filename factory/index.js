'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.appTemplate('service/factory', 'scripts/services/' + this.name);
  this.testTemplate('spec/service', 'services/' + this.name);
  this.addScriptToIndex('services/' + this.name);
};
