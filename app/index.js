'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.option('coffee');
  this.option('minsafe');

  var args = ['main'];

  if (this.options.coffee) {
    args.push('--coffee');
  }

  if (this.options.minsafe) {
    args.push('--minsafe');
  }

  this.hookFor('angular:common', {
    args: args
  });

  this.hookFor('angular:main', {
    args: args
  });

  this.hookFor('angular:controller', {
    args: args
  });

  this.hookFor('testacular:app', {
    args: [false] // run testacular hook in non-interactive mode
  });

  this.on('end', function () {
    console.log('\nI\'m all done. Just run ' + 'npm install && bower install'.bold.yellow + ' to install the required dependencies.');
  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, {
    name: 'compassBootstrap',
    message: 'If so, would you like to use Twitter Bootstrap for Compass (as opposed to vanilla CSS)?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }];

  this.prompt(prompts, function(err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bootstrap = (/y/i).test(props.bootstrap);
    this.compassBootstrap = (/y/i).test(props.compassBootstrap);

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules () {
  var cb = this.async();

  var prompts = [{
    name: 'resourceModule',
    message: 'Would you like to include angular-resource.js?',
    default: 'Y/n',
    warning: 'Yes: angular-resource added to component.json'
  }, {
    name: 'cookiesModule',
    message: 'Would you like to include angular-cookies.js?',
    default: 'Y/n',
    warning: 'Yes: angular-cookies added to component.json'
  }, {
    name: 'sanitizeModule',
    message: 'Would you like to include angular-sanitize.js?',
    default: 'Y/n',
    warning: 'Yes: angular-sanitize added to component.json'
  }];

  this.prompt(prompts, function(err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.resourceModule = (/y/i).test(props.resourceModule);
    this.cookiesModule = (/y/i).test(props.cookiesModule);
    this.sanitizeModule = (/y/i).test(props.sanitizeModule);

    cb();
  }.bind(this));
};

// Duplicated from the SASS generator, waiting a solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  if (this.compassBootstrap) {
    var cb = this.async();

    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');
    this.remote('kristianmandrup', 'compass-twitter-bootstrap', 'c3ccce2cca5ec52437925e8feaaa11fead51e132', function (err, remote) {
      if (err) {
        return cb(err);
      }
      remote.directory('stylesheets', 'app/styles');
      cb();
    });
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy( 'bootstrap.css', 'app/styles/bootstrap.css' );
  }

  if (this.bootstrap || this.compassBootstrap) {
    this.directory( 'images', 'app/images' );
  }
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.template('../../templates/common/index.html', 'app/index.html');
};

Generator.prototype.packageFiles = function () {
  this.template( '../../templates/common/component.json', 'component.json' );
  this.template( '../../templates/common/package.json', 'package.json' );
  this.template( '../../templates/common/Gruntfile.js', 'Gruntfile.js' );
};
