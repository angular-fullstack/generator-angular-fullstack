'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  if (typeof this.env.options.jade === 'undefined') {
    this.option('jade', {
      desc: 'Generate views using Jade templates'
    });

    // attempt to detect if user is using jade or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.jade &&
      this.expandFiles(path.join(this.env.options.appPath, '/views/**/*.jade'), {}).length > 0) {
      this.options.jade = true;
    }

    this.env.options.jade = this.options.jade;
  }

  this.viewSuffix = '.html';
  if (this.env.options.jade) {
    this.viewSuffix = '.jade';
  }
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createViewFiles = function createViewFiles() {
  var templatePath = this.env.options.jade ? 'jade' : 'html';
  this.template(path.join(
                  'views',
                  templatePath,
                  'view' + this.viewSuffix),
                path.join(
                  this.env.options.appPath,
                  'views',
                  'partials',
                   this.name.toLowerCase() + this.viewSuffix)
  );
};
