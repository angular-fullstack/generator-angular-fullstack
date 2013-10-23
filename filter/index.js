'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.generateSourceAndTest(
    'filter',
    'spec/filter',
    'filters',
    this.options['skip-add'] || false
  );
};
