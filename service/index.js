
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  //this.sourceRoot(path.join(__dirname, '../templates'));

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
  this.template(path.join('service', this.type), 'app/scripts/services/' + this.name);
  this.template('spec/service', 'test/spec/services/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function() {
  angularUtils.rewriteFile({
    file: 'app/index.html',
    needle: '<!-- endbuild -->',
    splicable: [
      '<script src="scripts/services/' + this.name + '.js"></script>'
    ]
  });
};
