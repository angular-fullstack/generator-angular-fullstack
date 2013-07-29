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
  var htmlTemplatePath = this.name + '.html',
    splicable,
    filePath = path.join(this.env.options.appPath, 'scripts/app.');

  if (htmlTemplatePath.indexOf('/') === -1) {
    htmlTemplatePath = 'views/' + htmlTemplatePath;
  }

  if (this.env.options.coffee) {
    splicable = [
      '.when \'/' + this.name + '\',',
      '  templateUrl: \'' + htmlTemplatePath + '\',',
      '  controller: \'' + this._.classify(this.name) + 'Ctrl\''
    ];
    filePath += 'coffee';
  } else {
    splicable = [
      '.when(\'/' + this.name + '\', {',
      '  templateUrl: \'' + htmlTemplatePath + '\',',
      '  controller: \'' + this._.classify(this.name) + 'Ctrl\'',
      '})'
    ];
    filePath += 'js';
  }

  angularUtils.rewriteFile({
    file: filePath,
    needle: '.otherwise',
    splicable: splicable
  });
};
