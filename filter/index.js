
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.template('filter', 'app/scripts/filters/' + this.name);
  this.template('spec/filter', 'test/spec/filters/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function() {
  angularUtils.rewriteFile({
    file: 'app/index.html',
    needle: '<!-- endbuild -->',
    splicable: [
      '<script src="scripts/filters/' + this.name + '.js"></script>'
    ]
  });
};
