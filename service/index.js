'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);

  var allowedTypes = [
    'constant',
    'factory',
    'provider',
    'service',
    'value'
  ];

  this.argument('type', {
    type: String,
    defaults: 'factory',
    banner: '[type]',
    required: false
  });

  if (allowedTypes.indexOf(this.type) === -1) {
    this.type = 'factory';
  }
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.appTemplate(path.join('service', this.type), 'scripts/services/' + this.name);
  this.testTemplate('spec/service', 'services/' + this.name);
  this.addScriptToIndex('services/' + this.name);
};
