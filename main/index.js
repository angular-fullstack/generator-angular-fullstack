'use strict';
var util = require('util');
var path = require('path');
var ScriptBase = require('../script-base.js');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createAppFile = function createAppFile() {
  this.angularModules = this.env.options.angularDeps;
  this.appTemplate('app', 'scripts/app');
};
