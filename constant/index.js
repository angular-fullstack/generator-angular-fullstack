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

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.appTemplate('service/constant', 'scripts/services/' + this.name);
  this.testTemplate('spec/service', 'services/' + this.name);
  this.addScriptToIndex('services/' + this.name);
};
