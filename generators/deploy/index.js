'use strict';
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var util = require('util');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.deprecated = function deprecated() {
  this.log(chalk.yellow(chalk.bold('yo angular-fullstack:deploy') + ' is deprecated, instead use: \n') +
           chalk.green('yo angular-fullstack:heroku') + ' or ' + chalk.green('yo angular-fullstack:openshift'));
};
