'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.deployHeroku = function deployHeroku() {
  if(this.name.toLowerCase() != "heroku") return;
  this.template('../deploy/heroku/Procfile', 'heroku/Procfile');
};
