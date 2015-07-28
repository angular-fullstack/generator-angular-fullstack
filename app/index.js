'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var genUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var AngularFullstackGenerator = yeoman.generators.Base.extend({

  initializing: {

    init: function () {
      this.argument('name', { type: String, required: false });
      this.appname = this.name || path.basename(process.cwd());
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

      // dynamic assertion statement
      this.does = this.is = function(foo) {
        if (this.filters.should) {
          return foo + '.should';
        } else {
          return 'expect(' + foo + ').to';
        }
      }.bind(this);
    },

    info: function () {
      this.log(this.welcome);
      this.log('Out of the box I create an AngularJS app with an Express server.\n');
    },

    checkForConfig: function() {
      var cb = this.async();

      if(this.config.get('filters')) {
        this.prompt([{
          type: 'confirm',
          name: 'skipConfig',
          message: 'Existing .yo-rc configuration found, would you like to use it?',
          default: true,
        }], function (answers) {
          this.skipConfig = answers.skipConfig;

          this.filters = this._.defaults(this.config.get('filters'), {
            bootstrap: true,
            uibootstrap: true,
            jasmine: true
          });

          // NOTE: temp(?) fix for #403
          if(typeof this.filters.oauth === 'undefined') {
            var strategies = Object.keys(this.filters).filter(function(key) {
              return key.match(/Auth$/) && this.filters[key];
            }.bind(this));

            if(strategies.length) this.filters.oauth = true;
          }

          this.config.set('filters', this.filters);
          this.config.forceSave();

          cb();
        }.bind(this));
      } else {
        cb();
      }
    }

  },

  prompting: {

    clientPrompts: function() {
      if(this.skipConfig) return;
      var cb = this.async();

      this.log('# Client\n');

      this.prompt([{
          type: 'list',
          name: 'script',
          message: 'What would you like to write scripts with?',
          choices: [ 'JavaScript', 'CoffeeScript'],
          filter: function( val ) {
            var filterMap = {
              'JavaScript': 'js',
              'CoffeeScript': 'coffee'
            };

            return filterMap[val];
          }
        }, {
          type: 'confirm',
          name: 'babel',
          message: 'Would you like to use Javascript ES6 in your client by preprocessing it with Babel?',
          when: function (answers) {
            return answers.script === 'js';
          }
        }, {
          type: 'list',
          name: 'markup',
          message: 'What would you like to write markup with?',
          choices: ['HTML', 'Jade'],
          filter: function( val ) { return val.toLowerCase(); }
        }, {
          type: 'list',
          name: 'stylesheet',
          default: 1,
          message: 'What would you like to write stylesheets with?',
          choices: [ 'CSS', 'Sass', 'Stylus', 'Less'],
          filter: function( val ) { return val.toLowerCase(); }
        },  {
          type: 'list',
          name: 'router',
          default: 1,
          message: 'What Angular router would you like to use?',
          choices: [ 'ngRoute', 'uiRouter'],
          filter: function( val ) { return val.toLowerCase(); }
        }, {
          type: 'confirm',
          name: 'bootstrap',
          message: 'Would you like to include Bootstrap?'
        }, {
          type: 'confirm',
          name: 'uibootstrap',
          message: 'Would you like to include UI Bootstrap?',
          when: function (answers) {
            return answers.bootstrap;
          }
        }], function (answers) {

          this.filters.babel = !!answers.babel;
          if(this.filters.babel){ this.filters.js = true; }
          this.filters[answers.script] = true;
          this.filters[answers.markup] = true;
          this.filters[answers.stylesheet] = true;
          this.filters[answers.router] = true;
          this.filters.bootstrap = !!answers.bootstrap;
          this.filters.uibootstrap =  !!answers.uibootstrap;
          cb();
        }.bind(this));
    },

    serverPrompts: function() {
      if(this.skipConfig) return;
      var cb = this.async();
      var self = this;

      this.log('\n# Server\n');

      this.prompt([{
        type: 'checkbox',
        name: 'odms',
        message: 'What would you like to use for data modeling?',
        choices: [
          {
            value: 'mongoose',
            name: 'Mongoose (MongoDB)',
            checked: true
          },
          {
            value: 'sequelize',
            name: 'Sequelize (MySQL, SQLite, MariaDB, PostgreSQL)',
            checked: false
          }
        ]
      }, {
        type: 'list',
        name: 'models',
        message: 'What would you like to use for the default models?',
        choices: [ 'Mongoose', 'Sequelize' ],
        filter: function( val ) {
          return val.toLowerCase();
        },
        when: function(answers) {
          return answers.odms && answers.odms.length > 1;
        }
      }, {
        type: 'confirm',
        name: 'auth',
        message: 'Would you scaffold out an authentication boilerplate?',
        when: function (answers) {
          return answers.odms && answers.odms.length !== 0;
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
        type: 'confirm',
        name: 'socketio',
        message: 'Would you like to use socket.io?',
        // to-do: should not be dependent on ODMs
        when: function (answers) {
          return answers.odms && answers.odms.length !== 0;
        },
        default: true
      }], function (answers) {
        if(answers.socketio) this.filters.socketio = true;
        if(answers.auth) this.filters.auth = true;
        if(answers.odms && answers.odms.length > 0) {
          var models;
          if(!answers.models) {
            models = answers.odms[0];
          } else {
            models = answers.models;
          }
          this.filters.models = true;
          this.filters[models + 'Models'] = true;
          answers.odms.forEach(function(odm) {
            this.filters[odm] = true;
          }.bind(this));
        } else {
          this.filters.noModels = true;
        }
        if(answers.oauth) {
          if(answers.oauth.length) this.filters.oauth = true;
          answers.oauth.forEach(function(oauthStrategy) {
            this.filters[oauthStrategy] = true;
          }.bind(this));
        }

        cb();
      }.bind(this));
    },

    projectPrompts: function() {
      if(this.skipConfig) return;
      var cb = this.async();
      var self = this;

      this.log('\n# Project\n');

      this.prompt([{
        type: 'list',
        name: 'testing',
        message: 'What would you like to write tests with?',
        choices: [ 'Jasmine', 'Mocha + Chai + Sinon'],
        filter: function( val ) {
          var filterMap = {
            'Jasmine': 'jasmine',
            'Mocha + Chai + Sinon': 'mocha'
          };

          return filterMap[val];
        }
      }, {
        type: 'list',
        name: 'chai',
        message: 'What would you like to write Chai assertions with?',
        choices: ['Expect', 'Should'],
        filter: function( val ) {
          return val.toLowerCase();
        },
        when: function( answers ) {
          return  answers.testing === 'mocha';
        }
      }], function (answers) {
        /**
         * Default to grunt until gulp support is implemented
         */
        this.filters.grunt = true;

        this.filters[answers.testing] = true;
        if (answers.testing === 'mocha') {
          this.filters.jasmine = false;
          this.filters.should = false;
          this.filters.expect = false;
          this.filters[answers.chai] = true;
        }
        if (answers.testing === 'jasmine') {
          this.filters.mocha = false;
          this.filters.should = false;
          this.filters.expect = false;
        }

        cb();
      }.bind(this));
    }

  },

  configuring: {

    saveSettings: function() {
      if(this.skipConfig) return;
      this.config.set('endpointDirectory', 'server/api/');
      this.config.set('insertRoutes', true);
      this.config.set('registerRoutesFile', 'server/routes.js');
      this.config.set('routesNeedle', '// Insert routes below');

      this.config.set('routesBase', '/api/');
      this.config.set('pluralizeRoutes', true);

      this.config.set('insertSockets', true);
      this.config.set('registerSocketsFile', 'server/config/socketio.js');
      this.config.set('socketsNeedle', '// Insert sockets below');

      this.config.set('insertModels', true);
      this.config.set('registerModelsFile', 'server/sqldb/index.js');
      this.config.set('modelsNeedle', '// Insert models below');

      this.config.set('filters', this.filters);
      this.config.forceSave();
    },

    ngComponent: function() {
      if(this.skipConfig) return;
      var appPath = 'client/app/';
      var extensions = [];
      var filters = [
        'ngroute',
        'uirouter',
        'jasmine',
        'mocha',
        'expect',
        'should'
      ].filter(function(v) {return this.filters[v];}, this);

      if(this.filters.ngroute) filters.push('ngroute');
      if(this.filters.uirouter) filters.push('uirouter');
      if(this.filters.babel) extensions.push('babel');
      if(this.filters.coffee) extensions.push('coffee');
      if(this.filters.js) extensions.push('js');
      if(this.filters.html) extensions.push('html');
      if(this.filters.jade) extensions.push('jade');
      if(this.filters.css) extensions.push('css');
      if(this.filters.stylus) extensions.push('styl');
      if(this.filters.sass) extensions.push('scss');
      if(this.filters.less) extensions.push('less');

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
      var angModules = [
        "'ngCookies'",
        "'ngResource'",
        "'ngSanitize'"
      ];
      if(this.filters.ngroute) angModules.push("'ngRoute'");
      if(this.filters.socketio) angModules.push("'btford.socket-io'");
      if(this.filters.uirouter) angModules.push("'ui.router'");
      if(this.filters.uibootstrap) angModules.push("'ui.bootstrap'");

      this.angularModules = '\n  ' + angModules.join(',\n  ') +'\n';
    }

  },

  default: {},

  writing: {

    generateProject: function() {
      this.sourceRoot(path.join(__dirname, './templates'));
      genUtils.processDirectory(this, '.', '.');
    },

    generateEndpoint: function() {
      var models;
      if (this.filters.mongooseModels) {
        models = 'mongoose';
      } else if (this.filters.sequelizeModels) {
        models = 'sequelize';
      }
      this.composeWith('angular-fullstack:endpoint', {
        options: {
          route: '/api/things',
          models: models
        },
        args: ['thing']
      });
    }

  },

  install: {

    installDeps: function() {
      this.installDependencies({
        skipInstall: this.options['skip-install']
      });
    }

  },

  end: {}

});

module.exports = AngularFullstackGenerator;
