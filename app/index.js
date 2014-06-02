'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var genUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');


var AngularFullstackGenerator = yeoman.generators.Base.extend({

  init: function () {
    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.option('app-suffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: String,
      required: 'false'
    });
    this.scriptAppName = this.appname + genUtils.appName(this);
    this.appPath = this.env.options.appPath;
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.installDependencies({
        skipInstall: this.options['skip-install']
      });
    }.bind(this));
  },

  info: function () {
    console.log(this.yeoman);
    console.log('Out of the box I include AngularJS and an Express server.\n');
  },

  prompt: function() {
    var cb = this.async();

    this.prompt([{
      type: 'confirm',
      name: 'compass',
      message: 'Would you like to use Sass?',
      default: true
    }], function (props) {
      this.compass = props.compass;

      cb();
    }.bind(this));
  },

  saveSettings: function() {
    this.config.set('filters', [
      'js',
      'html',
      'sass',
      'socketio',
      'auth',
      'mongoose'
    ]);
    this.less = false;
    this.sass = true;
    this.jade = false;
    this.coffee = false;
    this.mongoose = true;
    this.auth = true;
    this.socketio = true;
    this.facebookAuth = false;
    this.googleAuth = false;
    this.twitterAuth = false;
    var angModules = [
      "'ngCookies'",
      "'ngResource'",
      "'ngSanitize'",
      "'ngRoute'",
      "'ui.bootstrap'",
      "'btford.socket-io'"
    ];

    this.angularModules = "\n  " + angModules.join(",\n  ") +"\n";

    this.config.save();
  },

  generate: function() {
    this.sourceRoot(path.join(__dirname, './templates'));
    genUtils.processDirectory(this, '.', '.');
  }
});

module.exports = AngularFullstackGenerator;

// var Generator = module.exports = function Generator(args, options) {
//   yeoman.generators.Base.apply(this, arguments);
//   this.argument('appname', { type: String, required: false });
//   this.appname = this.appname || path.basename(process.cwd());
//   this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

//   this.option('app-suffix', {
//     desc: 'Allow a custom suffix to be added to the module name',
//     type: String,
//     required: 'false'
//   });
//   this.scriptAppName = this.appname + genUtils.appName(this);

//   this.appPath = this.env.options.appPath;

//   // this.sourceRoot(path.join(__dirname, '../templates/common'));
//   // this.directory('root', '.', true);
//   // this.copy('gitignore', '.gitignore');
//   // this.appTemplate('app', 'scripts/app');

//   this.on('end', function () {
//     this.installDependencies({
//       skipInstall: this.options['skip-install'],
//       callback: this._injectDependencies.bind(this)
//     });

//     var enabledComponents = [];

//     // this.invoke('karma:app', {
//     //   options: {
//     //     coffee: this.options.coffee,
//     //     testPath: 'test/client',
//     //     travis: true,
//     //     'skip-install': true,
//     //     components: [
//     //       'angular/angular.js',
//     //       'angular-mocks/angular-mocks.js'
//     //     ].concat(enabledComponents)
//     //   }
//     // });

//   });

//   this.pkg = require('../package.json');
// };

// util.inherits(Generator, yeoman.generators.Base);

// Generator.prototype.welcome = function welcome() {
//   // welcome message
//   if (!this.options['skip-welcome-message']) {
//     console.log(this.yeoman);
//     console.log(
//       'Out of the box I include AngularJS and an Express server.\n'
//     );
//   }
// };

// Generator.prototype.askForCompass = function askForCompass() {
//   var cb = this.async();

//   this.prompt([{
//     type: 'confirm',
//     name: 'compass',
//     message: 'Would you like to use Sass?',
//     default: true
//   }], function (props) {
//     this.compass = props.compass;

//     cb();
//   }.bind(this));
// };

// Generator.prototype.askForBootstrap = function askForBootstrap() {
//   var compass = this.compass;
//   var cb = this.async();

//   this.prompt([{
//     type: 'confirm',
//     name: 'bootstrap',
//     message: 'Would you like to include Twitter Bootstrap?',
//     default: true
//   }], function (props) {
//     this.bootstrap = props.bootstrap;

//     cb();
//   }.bind(this));
// };

// Generator.prototype.copyFiles = function copyFiles() {
//   // this.sourceRoot(path.join(__dirname, 'client'));
//   // this.processDirectory('app');
// };

// mongodb, user authentication boilerplate

