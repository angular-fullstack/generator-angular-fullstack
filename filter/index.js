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

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.template('filter', 'app/scripts/filters/' + this.name);
  this.template('spec/filter', 'test/spec/filters/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function () {
  angularUtils.rewriteFile({
    file: 'app/index.html',
    needle: '<!-- endbuild -->',
    splicable: [
      '<script src="scripts/filters/' + this.name + '.js"></script>'
    ]
  });
};
