'use strict';

import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import { runCmd } from '../util';
import chalk from 'chalk';
import {Base} from 'yeoman-generator';
import {genBase} from '../generator-base';
import insight from '../insight-init';
import {exec} from 'child_process';
import babelStream from 'gulp-babel';
import beaufityStream from 'gulp-beautify';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import semver from 'semver';

export class Generator extends Base {
  constructor(...args) {
    super(...args);

    this.argument('name', { type: String, required: false });

    this.option('skip-install', {
      desc: 'Do not install dependencies',
      type: Boolean,
      defaults: false
    });

    this.option('skip-config', {
      desc: 'Always use existing .yo-rc.json',
      type: Boolean,
      defaults: false
    });

    this.option('app-suffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: String,
      defaults: 'App'
    });

    this.option('dev-port', {
      desc: 'Port to use for the development HTTP server',
      type: String,
      defaults: '9000'
    });

    this.option('debug-port', {
      desc: 'Port to use for the server debugger',
      type: String,
      defaults: '5858'
    });

    this.option('prod-port', {
      desc: 'Port to use for the production HTTP Server',
      type: String,
      defaults: '8080'
    });
  }

  get initializing() {
    return {
      init: function () {
        this.config.set('generatorVersion', this.rootGeneratorVersion());
        this.filters = {};

        // init shared generator properies and methods
        const genBasePromise = genBase(this);
        let promises = [genBasePromise];

        if(process.env.CI) {
          insight.optOut = true;
        } else if(insight.optOut === undefined) {
          promises.push(new Promise((resolve, reject) => {
            insight.askPermission(null, (err, optIn) => {
              if(err) return reject(err);
              else return resolve(optIn);
            });
          }));
        }

        insight.track('generator', this.rootGeneratorVersion());
        this.nodeVersion = semver.clean(process.version);
        this.semver = semver;
        insight.track('node', this.nodeVersion);
        insight.track('platform', process.platform);

        const npmVersionPromise = runCmd('npm --version').then(stdout => {
          this.npmVersion = stdout.toString().trim();
          return insight.track('npm', this.npmVersion);
        });
        promises.push(npmVersionPromise);

        return Promise.all(promises);
      },
      info: function () {
        this.log(this.yoWelcome);
        this.log('Out of the box I create an AngularJS app with an Express server.\n');
      },
      checkForConfig: function() {
        var existingFilters = this.config.get('filters');

        if(!existingFilters) return;

        let promise = this.options['skip-config']
          ? Promise.resolve({skipConfig: true})
          : this.prompt([{
              type: 'confirm',
              name: 'skipConfig',
              message: 'Existing .yo-rc configuration found, would you like to use it?',
              default: true,
            }]);

        promise.then(answers => {
          this.skipConfig = answers.skipConfig;

          if(this.skipConfig) {
            insight.track('skipConfig', 'true');
            this.filters = existingFilters;

            this.scriptExt = this.filters.ts ? 'ts' : 'js';
            this.templateExt = this.filters.jade ? 'jade' : 'html';
            this.styleExt = this.filters.sass ? 'scss' :
              this.filters.less ? 'less' :
              this.filters.stylus ? 'styl' :
              'css';
          } else {
            insight.track('skipConfig', 'false');
            this.filters = {};
            this.forceConfig = true;
            this.config.set('filters', this.filters);
            this.config.forceSave();
          }
        });
      }
    };
  }

  get prompting() {
    return {
      clientPrompts: function() {
        if(this.skipConfig) return;

        this.log('# Client\n');

        return this.prompt([{
            type: 'list',
            name: 'transpiler',
            message: 'What would you like to write scripts with?',
            choices: ['Babel', 'TypeScript'],
            filter: val => {
              return {
                'Babel': 'babel',
                'TypeScript': 'ts'
              }[val];
            }
          }, {
            type: 'confirm',
            name: 'flow',
            default: false,
            message: 'Would you like to use Flow types with Babel?',
            when: answers => answers.transpiler === 'babel'
          }, {
            type: 'list',
            name: 'markup',
            message: 'What would you like to write markup with?',
            choices: ['HTML', 'Jade'],
            filter: val => val.toLowerCase()
          }, {
            type: 'list',
            name: 'stylesheet',
            default: 1,
            message: 'What would you like to write stylesheets with?',
            choices: ['CSS', 'Sass', 'Stylus', 'Less'],
            filter: val => val.toLowerCase()
          },  {
            type: 'list',
            name: 'router',
            default: 1,
            message: 'What Angular router would you like to use?',
            choices: ['ngRoute', 'uiRouter'],
            filter: val => val.toLowerCase()
          }, {
            type: 'confirm',
            name: 'bootstrap',
            message: 'Would you like to include Bootstrap?'
          }, {
            type: 'confirm',
            name: 'uibootstrap',
            message: 'Would you like to include UI Bootstrap?',
            when: answers => answers.bootstrap
          }]).then(answers => {
            this.filters.js = true;
            this.filters[answers.transpiler] = true;
            insight.track('transpiler', answers.transpiler);

            this.filters.flow = !!answers.flow;
            insight.track('flow', !!answers.flow);

            this.filters[answers.markup] = true;
            insight.track('markup', answers.markup);

            this.filters[answers.stylesheet] = true;
            insight.track('stylesheet', answers.stylesheet);

            this.filters[answers.router] = true;
            insight.track('router', answers.router);

            this.filters.bootstrap = !!answers.bootstrap;
            insight.track('bootstrap', !!answers.bootstrap);

            this.filters.uibootstrap =  !!answers.uibootstrap;
            insight.track('uibootstrap', !!answers.uibootstrap);

            this.scriptExt = answers.transpiler === 'ts' ? 'ts' : 'js';
            this.templateExt = answers.markup;

            var styleExt = {sass: 'scss', stylus: 'styl'}[answers.stylesheet];
            this.styleExt = styleExt ? styleExt : answers.stylesheet;
          });
      },
      serverPrompts: function() {
        if(this.skipConfig) return;
        var self = this;

        this.log('\n# Server\n');

        return this.prompt([{
          type: 'checkbox',
          name: 'odms',
          message: 'What would you like to use for data modeling?',
          choices: [{
            value: 'mongoose',
            name: 'Mongoose (MongoDB)',
            checked: true
          }, {
            value: 'sequelize',
            name: 'Sequelize (MySQL, SQLite, MariaDB, PostgreSQL)',
            checked: false
          }]
        }, {
          type: 'list',
          name: 'models',
          message: 'What would you like to use for the default models?',
          choices: [ 'Mongoose', 'Sequelize' ],
          filter: val => val.toLowerCase(),
          when: answers => answers.odms && answers.odms.length > 1
        }, {
          type: 'confirm',
          name: 'auth',
          message: 'Would you scaffold out an authentication boilerplate?',
          when: answers => answers.odms && answers.odms.length !== 0
        }, {
          type: 'checkbox',
          name: 'oauth',
          message: 'Would you like to include additional oAuth strategies?',
          when: answers => answers.auth,
          choices: [{
            value: 'googleAuth',
            name: 'Google',
            checked: false
          }, {
            value: 'facebookAuth',
            name: 'Facebook',
            checked: false
          }, {
            value: 'twitterAuth',
            name: 'Twitter',
            checked: false
          }]
        }, {
          type: 'confirm',
          name: 'socketio',
          message: 'Would you like to use socket.io?',
          // to-do: should not be dependent on ODMs
          when: answers => answers.odms && answers.odms.length !== 0,
          default: true
        }]).then(answers => {
          if(answers.socketio) this.filters.socketio = true;
          insight.track('socketio', !!answers.socketio);

          if(answers.auth) this.filters.auth = true;
          insight.track('auth', !!answers.auth);

          if(answers.odms && answers.odms.length > 0) {
            var models;
            if(!answers.models) {
              models = answers.odms[0];
            } else {
              models = answers.models;
            }
            this.filters.models = true;
            this.filters[models + 'Models'] = true;
            answers.odms.forEach(odm => {
              this.filters[odm] = true;
            });
            insight.track('oauth', !!answers.oauth);
          } else {
            this.filters.noModels = true;
          }
          insight.track('odms', answers.odms && answers.odms.length > 0);
          insight.track('mongoose', !!this.filters.mongoose);
          insight.track('mongooseModels', !!this.filters.mongooseModels);
          insight.track('sequelize', !!this.filters.sequelize);
          insight.track('sequelizeModels', !!this.filters.sequelizeModels);

          if(answers.oauth) {
            if(answers.oauth.length) this.filters.oauth = true;
            answers.oauth.forEach(oauthStrategy => {
              this.filters[oauthStrategy] = true;
            });
          }
          insight.track('oauth', !!this.filters.oauth);
          insight.track('google-oauth', !!this.filters['googleAuth']);
          insight.track('facebook-oauth', !!this.filters['facebookAuth']);
          insight.track('twitter-oauth', !!this.filters['twitterAuth']);
        });
      },
      projectPrompts: function() {
        if(this.skipConfig) return;
        var self = this;

        this.log('\n# Project\n');

        return this.prompt([{
          type: 'list',
          name: 'testing',
          message: 'What would you like to write tests with?',
          choices: ['Jasmine', 'Mocha + Chai + Sinon'],
          default: 1,
          filter: function(val) {
            return {
              'Jasmine': 'jasmine',
              'Mocha + Chai + Sinon': 'mocha'
            }[val];
          }
        }, {
          type: 'list',
          name: 'chai',
          message: 'What would you like to write Chai assertions with?',
          choices: ['Expect', 'Should'],
          filter: val => val.toLowerCase(),
          when: answers => answers.testing === 'mocha'
        }]).then(answers => {
          this.filters[answers.testing] = true;
          insight.track('testing', answers.testing);
          if(answers.testing === 'mocha') {
            this.filters.jasmine = false;
            this.filters.should = false;
            this.filters.expect = false;
            this.filters[answers.chai] = true;
            insight.track('chai-assertions', answers.chai);
          }
          if(answers.testing === 'jasmine') {
            this.filters.mocha = false;
            this.filters.should = false;
            this.filters.expect = false;
          }
        });
      }
    };
  }

  get configuring() {
    return {
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
        ].filter(v => this.filters[v]);

        if(this.filters.ngroute) filters.push('ngroute');
        if(this.filters.uirouter) filters.push('uirouter');
        if(this.filters.babel) extensions.push('babel');
        if(this.filters.ts) extensions.push('ts');
        if(this.filters.js) extensions.push('js');
        if(this.filters.html) extensions.push('html');
        if(this.filters.jade) extensions.push('jade');
        if(this.filters.css) extensions.push('css');
        if(this.filters.stylus) extensions.push('styl');
        if(this.filters.sass) extensions.push('scss');
        if(this.filters.less) extensions.push('less');

        filters.push('es6'); // Generate ES6 syntax code

        this.composeWith('ng-component', {
          options: {
            'routeDirectory': appPath,
            'directiveDirectory': appPath,
            'filterDirectory': appPath,
            'serviceDirectory': appPath,
            'componentDirectory': `${appPath}components/`,
            'filters': filters,
            'extensions': extensions,
            'basePath': 'client',
            'forceConfig': this.forceConfig
          }
        }, { local: require.resolve('generator-ng-component/app/index.js') });
      },
      ngModules: function() {
        var angModules = [
          `'${this.scriptAppName}.constants'`,
          "'ngCookies'",
          "'ngResource'",
          "'ngSanitize'"
        ];
        if(this.filters.ngroute) angModules.push("'ngRoute'");
        if(this.filters.socketio) angModules.push("'btford.socket-io'");
        if(this.filters.uirouter) angModules.push("'ui.router'");
        if(this.filters.uibootstrap) angModules.push("'ui.bootstrap'");
        if(this.filters.auth) {
          angModules.unshift(`'${this.scriptAppName}.admin'`);
          angModules.unshift(`'${this.scriptAppName}.auth'`);
          angModules.push("'validation.match'");
        }

        this.angularModules = '\n  ' + angModules.join(',\n  ') +'\n';
      }
    };
  }

  get default() {
    return {};
  }

  get writing() {
    return {
      generateProject: function() {
        /**
         * var tap = require('gulp-tap');
           this.registerTransformStream([
              extensionFilter,
              tap(function(file, t) {
                  var contents = file.contents.toString();
                  contents = beautify_js(contents, config);
                  file.contents = new Buffer(contents);
              }),
              //prettifyJs(config),
              extensionFilter.restore
           ]);
         */

        const flow = this.filters.flow;

        let babelPlugins = [
          'babel-plugin-syntax-flow',
          'babel-plugin-syntax-class-properties'
        ];

        if(this.filters.babel && !flow) {
          babelPlugins.push('babel-plugin-transform-flow-strip-types');
        }

        let jsFilter = filter(['client/**/*.js'], {restore: true});
        this.registerTransformStream([
          jsFilter,
          babelStream({
            plugins: babelPlugins.map(require.resolve),
            /* Babel get's confused about these if you're using an `npm link`ed
                generator-angular-fullstack, thus the `require.resolve` */
            shouldPrintComment(commentContents) {
              if(flow) {
                return true;
              } else {
                // strip `// @flow` comments if not using flow
                return !(/@flow/.test(commentContents));
              }
            },
            babelrc: false  // don't grab the generator's `.babelrc`
          }),
          beaufityStream({
            "indent_size": 2,
            "indent_char": " ",
            "indent_level": 0,
            "indent_with_tabs": false,
            "preserve_newlines": true,
            "max_preserve_newlines": 10,
            "jslint_happy": false,
            "space_after_anon_function": false,
            "brace_style": "collapse",
            "keep_array_indentation": false,
            "keep_function_indentation": false,
            "space_before_conditional": true,
            "break_chained_methods": true,
            "eval_code": false,
            "unescape_strings": false,
            "wrap_line_length": 100,
            "wrap_attributes": "auto",
            "wrap_attributes_indent_size": 4,
            "end_with_newline": true
          }),
          jsFilter.restore
        ]);

        /**
         * TypeScript doesn't play nicely with things that don't have a default export
         */
        if(this.filters.ts) {
          const modulesToFix = [
            ['angular', 'angular'],
            ['ngCookies', 'angular-cookies'],
            ['ngResource', 'angular-resource'],
            ['ngSanitize', 'angular-sanitize'],
            ['uiRouter', 'angular-ui-router'],
            ['uiBootstrap', 'angular-ui-bootstrap'],
            ['ngMessages', 'angular-messages'],
            ['io', 'socket.io-client']
          ];
          function replacer(contents) {
            modulesToFix.forEach(([moduleName, importName]) => {
              contents = contents.replace(
                `import ${moduleName} from '${importName}'`,
                `const ${moduleName} = require('${importName}')`
              );
            });
            return contents;
          }

          let tsFilter = filter(['client/**/*.ts'], {restore: true});
          this.registerTransformStream([
            tsFilter,
            tap(function(file, t) {
              var contents = file.contents.toString();
              contents = replacer(contents);
              file.contents = new Buffer(contents);
            }),
            tsFilter.restore
          ]);
        }

        let self = this;
        this.sourceRoot(path.join(__dirname, '../../templates/app'));
        this.processDirectory('.', '.');
      },
      generateEndpoint: function() {
        var models;
        if(this.filters.mongooseModels) {
          models = 'mongoose';
        } else if(this.filters.sequelizeModels) {
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
    };
  }

  install() {
    if(!this.options['skip-install']) {
      this.spawnCommand('npm', ['install']);
    }
  }

  get end() {
    return {};
  }
}

module.exports = Generator;
