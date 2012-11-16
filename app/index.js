  
var util = require('util'),
    path = require('path'),
    ScriptBase = require('../script-base.js'),
    yeoman = require('../../../../');

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
