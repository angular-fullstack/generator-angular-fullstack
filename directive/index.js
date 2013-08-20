'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.appTemplate('directive', 'scripts/directives/' + this.name);
  this.testTemplate('spec/directive', 'directives/' + this.name);
  this.addScriptToIndex('directives/' + this.name);
};
