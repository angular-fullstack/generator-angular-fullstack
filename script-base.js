'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));
  this.scriptAppName = this._.camelize(this.appname) + angularUtils.appName(this);

  var name = this.name.replace(/\//g, '-');

  this.cameledName = this._.camelize(name);
  this.classedName = this._.classify(name);

  this.basename = path.basename(this.name);
  this.dirname = (this.name.indexOf('/') >= 0) ? path.dirname(this.name) : this.name;

  // dynamic assertion statement
  this.does = this.is = function(foo) {
    foo = this.engine(foo.replace(/\(;>%%<;\)/g, '<%')
      .replace(/\(;>%<;\)/g, '%>'), this);
    if (this.filters.should) {
      return foo + '.should';
    } else {
      return 'expect(' + foo + ').to';
    }
  }.bind(this);

  // dynamic relative require path
  this.relativeRequire = function(to, fr) {
    fr = fr || this.filePath;
    return angularUtils.relativeRequire(this, to, fr);
  }.bind(this);

  this.filters = this.config.get('filters');
  this.sourceRoot(path.join(__dirname, '/templates'));
};

util.inherits(Generator, yeoman.generators.NamedBase);
