'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var angularUtils = require('../util.js');


module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.hookFor('angular:controller', {
    args: [this.name]
  });

  this.hookFor('angular:view', {
    args: [this.name]
  });
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.rewriteAppJs = function () {
  angularUtils.rewriteFile({
    file: 'app/scripts/app.js', // TODO: coffee
    needle: '.otherwise',
    splicable: [
      '.when(\'/' + this.name + '\', {',
      '  templateUrl: \'views/' + this.name + '.html\',',
      '  controller: \'' + this._.classify(this.name) + 'Ctrl\'',
      '})'
    ]
  });
};
