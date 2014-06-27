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
    this.filters = {};
    // skip config if filters are already defined
    if(this.config.get('filters')) {
      this.log('\nUsing existing yo-rc config.\n');
      this.skipConfig = true;
    }
  },

  info: function () {
    this.log(this.yeoman);
    this.log('Out of the box I create an AngularJS app with an Express server.\n');
  },

  clientPrompts: function() {
    if(this.skipConfig) return;
    var cb = this.async();

    this.log('# Client\n');

    this.prompt([{
        type: "list",
        name: "script",
        message: "What would you like to write scripts with?",
        choices: [ "JavaScript", "CoffeeScript"],
        filter: function( val ) {
          var filterMap = {
            'JavaScript': 'js',
            'CoffeeScript': 'coffee'
          };

          return filterMap[val];
        }
      }, {
        type: "list",
        name: "markup",
        message: "What would you like to write markup with?",
        choices: [ "HTML", "Jade"],
        filter: function( val ) { return val.toLowerCase(); }
      }, {
        type: "list",
        name: "stylesheet",
        default: 1,
        message: "What would you like to write stylesheets with?",
        choices: [ "CSS", "Sass", "Less"],
        filter: function( val ) { return val.toLowerCase(); }
      },  {
        type: "list",
        name: "router",
        default: 1,
        message: "What Angular router would you like to use?",
        choices: [ "ngRoute", "uiRouter"],
        filter: function( val ) { return val.toLowerCase(); }
      }], function (answers) {
        this.filters[answers.script] = true;
        this.filters[answers.markup] = true;
        this.filters[answers.stylesheet] = true;
        this.filters[answers.router] = true;
        cb();
      }.bind(this));
  },

  serverPrompts: function() {
    if(this.skipConfig) return;
    var cb = this.async();
    var self = this;

    this.log('\n# Server\n');

    this.prompt([{
      type: "confirm",
      name: "mongoose",
      message: "Would you like to use mongoDB with Mongoose for data modeling?"
    }, {
      type: "confirm",
      name: "auth",
      message: "Would you scaffold out an authentication boilerplate?",
      when: function (answers) {
        return answers.mongoose;
      }
    }, {
      type: 'checkbox',
      name: 'oauth',
      message: 'Would you like to include additional oAuth strategies?',
      when: function (answers) {
        return answers.auth;
      },
      choices: [
        {
          value: 'googleAuth',
          name: 'Google',
          checked: false
        },
        {
          value: 'facebookAuth',
          name: 'Facebook',
          checked: false
        },
        {
          value: 'twitterAuth',
          name: 'Twitter',
          checked: false
        }
      ]
    }, {
      type: "confirm",
      name: "socketio",
      message: "Would you like to use socket.io?",
      // to-do: should not be dependent on mongoose
      when: function (answers) {
        return answers.mongoose;
      },
      default: true
    }], function (answers) {
      if(answers.socketio) this.filters['socketio'] = true;
      if(answers.mongoose) this.filters['mongoose'] = true;
      if(answers.auth) this.filters['auth'] = true;
      if(answers.oauth) {
        answers.oauth.forEach(function(oauthStrategy) {
          this.filters[oauthStrategy] = true;
        }.bind(this));
      }

      cb();
    }.bind(this));
  },

  saveSettings: function() {
    if(this.skipConfig) return;
    this.config.set('insertRoutes', true);
    this.config.set('registerRoutesFile', 'server/routes.js');
    this.config.set('routesNeedle', '// Insert routes below');

    this.config.set('insertSockets', true);
    this.config.set('registerSocketsFile', 'server/config/socketio.js');
    this.config.set('socketsNeedle', '// Insert sockets below');

    this.config.set('filters', this.filters);
    this.config.forceSave();
  },

  compose: function() {
    if(this.skipConfig) return;
    var appPath = 'client/app/';
    var extensions = [];
    var filters = [];

    if(this.filters['ngroute']) filters.push('ngroute');
    if(this.filters['uirouter']) filters.push('uirouter');
    if(this.filters['coffee']) extensions.push('coffee');
    if(this.filters['js']) extensions.push('js');
    if(this.filters['html']) extensions.push('html');
    if(this.filters['jade']) extensions.push('jade');
    if(this.filters['css']) extensions.push('css');
    if(this.filters['sass']) extensions.push('scss');
    if(this.filters['less']) extensions.push('less');

    this.composeWith('ng-component', {
      options: {
        'routeDirectory': appPath,
        'directiveDirectory': appPath,
        'filterDirectory': appPath,
        'serviceDirectory': appPath,
        'filters': filters,
        'extensions': extensions,
        'basePath': 'client'
      }
    }, { local: require.resolve('generator-ng-component/app/index.js') });
  },

  ngModules: function() {
    this.filters = this.config.get('filters');
    var angModules = [
      "'ngCookies'",
      "'ngResource'",
      "'ngSanitize'",
      "'ngRoute'",
      "'ui.bootstrap'"
    ];
    if(this.filters['socketio']) angModules.push("'btford.socket-io'");
    if(this.filters['uirouter']) angModules.push("'ui.router'");

    this.angularModules = "\n  " + angModules.join(",\n  ") +"\n";
  },

  generate: function() {
    this.sourceRoot(path.join(__dirname, './templates'));
    genUtils.processDirectory(this, '.', '.');
  },

  end: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});

module.exports = AngularFullstackGenerator;