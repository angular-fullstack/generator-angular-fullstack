
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.option('coffee');
  this.appname = path.basename(process.cwd());
  
  var args = ['main'];

  if (this.options.coffee) {
    args.push('--coffee');
  }

  this.hookFor('angular:common', {
    args: args
  });

  this.hookFor('angular:app', {
    args: args
  });
  this.hookFor('angular:controller', {
    args: args
  });

  this.hookFor('testacular:app', {
    args: [false] // run testacular hook in non-interactive mode
  });
};

util.inherits(Generator, yeoman.generators.Base);
