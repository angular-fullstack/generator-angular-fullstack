'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk = require('chalk');
var path = require('path');
var s = require('underscore.string');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, './templates'));
  this.filters = this.config.get('filters') || {};
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.copyDockerfile = function copyDockerfile() {
  var done = this.async();
  this.log(chalk.bold('Creating Dockerfile'));
  this.fs.copyTpl(this.templatePath('_Dockerfile'), 'dist/Dockerfile', this );
  this.conflicter.resolve(function (err) {
    done();
  });
};

Generator.prototype.gruntBuild = function gruntBuild() {
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  var child = exec('grunt build', function (err, stdout) {
    done();
  }.bind(this));
  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};


