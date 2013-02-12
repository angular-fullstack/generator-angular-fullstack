'use strict';
var util = require('util');
var path = require('path');
var ScriptBase = require('../script-base.js');
var yeoman = require('yeoman-generator');


module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app', 'app/scripts/app');
};

Generator.prototype.createMainFiles = function createMainFiles() {
  this.htmlTemplate('../common/index.html', 'app/index.html');
};
