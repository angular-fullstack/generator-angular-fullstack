
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  grunt = require('grunt'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.template('directive.js', 'app/scripts/directives/' + this.name);
  this.template('spec/directive.js', 'test/spec/directives/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'app/index.html';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '<!-- endbuild -->',
    haystack: body,
    splicable: [
      '<script src="scripts/directives/' + this.name + '.js"></script>'
    ]
  });

  grunt.file.write(file, body);
};
