'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  this.hookFor('angular:controller');
  this.hookFor('angular:view');
}
util.inherits(Generator, ScriptBase);

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
