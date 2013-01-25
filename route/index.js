
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman-generator'),
  angularUtils = require('../util.js');

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

Generator.prototype.rewriteAppJs = function() {

  console.log(this);

  angularUtils.rewriteFile({
    file: 'app/scripts/app.js', // TODO: coffee
    needle: '.otherwise',
    splicable: [
      ".when('/" + this.name + "', {",
      "  templateUrl: 'views/" + this.name + ".html',",
      "  controller: '" + this.classify(this.name) + "Ctrl'",
      "})"
    ]
  });
};
