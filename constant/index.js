'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');


module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.appTemplate('service/constant');
  this.testTemplate('spec/service');
};
