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
  this.template('directive', 'app/scripts/directives/' + this.name);
  this.template('spec/directive', 'test/spec/directives/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function () {
  angularUtils.rewriteFile({
    file: 'app/index.html',
    needle: '<!-- endbuild -->',
    splicable: [
      '<script src="scripts/directives/' + this.name + '.js"></script>'
    ]
  });
};
