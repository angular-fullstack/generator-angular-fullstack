'use strict';
var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  var args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'component.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe');
    this.env.options.minsafe = this.options.minsafe;
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

  this.hookFor('karma', {
    as: 'app',
    options: {
      options: {
        coffee: this.options.coffee,
        'skip-install': this.options['skip-install']
       }
    }
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });
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

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bootstrap = (/y/i).test(props.bootstrap);
    this.compassBootstrap = (/y/i).test(props.compassBootstrap);

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
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

  this.prompt(prompts, function (err, props) {
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
  var appPath = this.appPath;

  if (this.compassBootstrap) {
    var cb = this.async();

    this.write(path.join(appPath, 'styles/main.scss'), '@import "compass_twitter_bootstrap";');
    this.remote('vwall', 'compass-twitter-bootstrap', 'v2.2.2.2', function (err, remote) {
      if (err) {
        return cb(err);
      }
      remote.directory('stylesheets', path.join(appPath, 'styles'));
      cb();
    });
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy('bootstrap.css', path.join(appPath, 'styles/bootstrap.css'));
  }

  if (this.bootstrap || this.compassBootstrap) {
    // this.directory('images', 'app/images');
  }
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.template('../../templates/common/index.html', path.join(this.appPath, 'index.html'));
};

Generator.prototype.packageFiles = function () {
  this.template('../../templates/common/component.json', 'component.json');
  this.template('../../templates/common/package.json', 'package.json');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};
