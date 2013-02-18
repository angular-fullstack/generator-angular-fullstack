/*global describe before it */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var util = require('util');
var generators = require('yeoman-generator');
var helpers = require('yeoman-generator').test;

describe('Angular generator', function () {
  var angular;

  beforeEach(function(done) {
    var deps = ['../../app', '../../common', '../../controller', '../../main', [helpers.createDummyGenerator(), 'testacular:app']];
    helpers.testDirectory(path.join(__dirname, 'temp'), function(err) {
      if (err) {
        done(err);
      }
      angular = helpers.createGenerator('angular:app', deps);
      done();
    });
  });

  it ('should generate dotfiles', function (done) {

    helpers.mockPrompt(angular, {'bootstrap': 'Y', 'compassBoostrap': 'Y'});

    angular.run({}, function() {
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
                    ['.bowerrc', /"directory": "app\/components"/],
                    'Gruntfile.js',
                    'package.json',
                    ['component.json', /"name":\s+"temp"/],
                    'test/vendor/angular-mocks.js',
                    'app/scripts/app.js',
                    'app/index.html',
                    'app/scripts/controllers/main.js',
                    'test/spec/controllers/main.js',
                    // 'testacular.conf.js'
                    ];
    helpers.mockPrompt(angular, {'bootstrap': 'Y', 'compassBoostrap': 'Y'});

    angular.run({}, function() {
      helpers.assertFiles(expected);
      done();
    });
  });

  describe('Controller', function() {
    it('should generate a new controller', function(done) {
      var angularCtrl;
      var deps = ['../../controller'];
      angularCtrl = helpers.createGenerator('angular:controller', deps, ['foo']);
  
      helpers.mockPrompt(angular, {'bootstrap': 'Y', 'compassBoostrap': 'Y'});
      angular.run([], function(){
      angularCtrl.run([], function() {
        helpers.assertFiles([
          ['app/scripts/controllers/foo.js', /controller\('FooCtrl'/],
          ['test/spec/controllers/foo.js', /describe\('Controller: FooCtrl'/]
        ]);
        done();
      });

      });
    });
  })
});
