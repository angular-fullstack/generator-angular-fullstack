/*global describe, before, it, beforeEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var util = require('util');
var generators = require('yeoman-generator');
var helpers = require('yeoman-generator').test;


describe('Angular generator', function () {
  var angular;

  beforeEach(function (done) {
    var deps = [
      '../../app',
      '../../common',
      '../../controller',
      '../../main', [
        helpers.createDummyGenerator(),
        'karma:app'
      ]
    ];
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }
      angular = helpers.createGenerator('angular:app', deps);
      angular.options['skip-install'] = true;
      done();
    });
  });

  it('should generate dotfiles', function (done) {
    helpers.mockPrompt(angular, {
      bootstrap: true,
      compassBoostrap: true,
      modules: []
    });

    angular.run({}, function () {
      helpers.assertFiles(['.bowerrc', '.gitignore', '.editorconfig', '.jshintrc']);
      done();
    });
  });

  it('creates expected files', function (done) {
    var expected = ['app/.htaccess',
                    'app/404.html',
                    'app/favicon.ico',
                    'app/robots.txt',
                    'app/styles/main.css',
                    'app/views/main.html',
                    ['.bowerrc', /"directory": "app\/bower_components"/],
                    'Gruntfile.js',
                    'package.json',
                    ['bower.json', /"name":\s+"temp"/],
                    'app/app/main.js',
                    'app/index.html',
                    'app/controller/main.js',
                    'test/spec/controller/main.js'
                    ];
    helpers.mockPrompt(angular, {
      bootstrap: true,
      compassBoostrap: true,
      modules: []
    });

    angular.run({}, function() {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates coffeescript files', function (done) {
    var expected = ['app/.htaccess',
                    'app/404.html',
                    'app/favicon.ico',
                    'app/robots.txt',
                    'app/styles/main.css',
                    'app/views/main.html',
                    ['.bowerrc', /"directory": "app\/bower_components"/],
                    'Gruntfile.js',
                    'package.json',
                    ['bower.json', /"name":\s+"temp"/],
                    'app/app/main.coffee',
                    'app/index.html',
                    'app/controller/main.coffee',
                    'test/spec/controller/main.coffee'
                    ];
    helpers.mockPrompt(angular, {
      bootstrap: true,
      compassBoostrap: true,
      modules: []
    });

    angular.env.options.coffee = true;
    angular.run([], function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  describe('Controller', function () {
    it('should generate a new controller', function (done) {
      var angularCtrl;
      var deps = ['../../controller'];
      angularCtrl = helpers.createGenerator('angular:controller', deps, ['foo']);

      helpers.mockPrompt(angular, {
        bootstrap: true,
        compassBoostrap: true,
        modules: []
      });
      angular.run([], function () {
        angularCtrl.run([], function () {
          helpers.assertFiles([
            ['app/controller/foo.js', /controller\('FooCtrl'/],
            ['test/spec/controller/foo.js', /describe\('Controller: FooCtrl'/]
          ]);
          done();
        });
      });
    });
  });

  describe('View', function () {
    it('should generate a new view', function (done) {
      var angularView;
      var deps = ['../../view'];
      angularView = helpers.createGenerator('angular:view', deps, ['foo']);

      helpers.mockPrompt(angular, {
        bootstrap: true,
        compassBoostrap: true,
        modules: []
      });
      angular.run([], function (){
        angularView.run([], function () {
          helpers.assertFiles([
            ['app/views/foo.html']
          ]);
          done();
        });
      });
    });
  });
});
