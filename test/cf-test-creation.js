/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-extra');
var exec = require('child_process').exec;

describe('angular-fullstack:cloudfoundry', function () {
  var gen, defaultOptions = {
    script: 'js',
    markup: 'html',
    stylesheet: 'sass',
    router: 'uirouter',
    bootstrap: true,
    uibootstrap: false,
    mongoose: false,
    auth: false,
    oauth: [],
    socketio: false
  };


  function generatorTest(generatorType, name, mockPrompt, callback) {
    gen.run({}, function () {
      var afGenerator;
      var deps = [path.join('../..', generatorType)];
      afGenerator = helpers.createGenerator('angular-fullstack:' + generatorType, deps, [name]);

      helpers.mockPrompt(afGenerator, mockPrompt);
      afGenerator.run([], function () {
        callback();
      });
    });
  }

  beforeEach(function (done) {
    this.timeout(10000);
    this.appname = 'testapp' + Math.floor(Math.random()*100000000).toString();
    var deps = [
      '../../app',
      [
        helpers.createDummyGenerator(),
        'ng-component:app'
      ]
    ];

    helpers.testDirectory(path.join(__dirname, this.appname), function (err) {
      if (err) {
        return done(err);
      }

      gen = helpers.createGenerator('angular-fullstack:app', deps);
      gen.options['skip-install'] = true;

      fs.mkdirSync(__dirname + '/' + this.appname + '/client');
      fs.symlinkSync(__dirname + '/fixtures/node_modules', __dirname + '/' + this.appname + '/node_modules');
      fs.symlinkSync(__dirname +'/fixtures/bower_components', __dirname + '/' + this.appname + '/client/bower_components');

      helpers.mockPrompt(gen, defaultOptions);
      this.timeout(60000);

      done();
    }.bind(this));
  });

  afterEach(function (done) {
    exec('cf delete ' + this.appname + " -r -f", function (error, stdout, stderr) {
      gen.log("Deleting cloudfoundry app instance for " + this.appname + "...");
      if (error) {
        gen.log(error);
      }
      done();
    }.bind(this));

  });

  afterEach(function (done) {
    exec('rm -rf ' + this.appname, { cwd: '..' }, function (error, stdout, stderr) {
      gen.log("Deleting local app instance for " + this.appname + "...");
      if (error) {
        gen.log(error);
      }
      done();
    }.bind(this));

  });

  it('copies procfile and manifest files with named route', function (done) {
    var mockPromptOptions = {
      routeName: Math.floor(Math.random()*100000000).toString(),
      apiEndpoint: ''
    };
    generatorTest('cloudfoundry', 'cf-test', mockPromptOptions, function () {
      helpers.assertFile([
        'dist/Procfile',
        'dist/manifest.yml'
      ]);
      exec('cf app ' + this.appname, function (error, stdout, stderr) {
        if (error) {
          console.log(error);
          console.log(stderr);
        }

        gen.log(stdout);
        expect(stdout, 'App failed to start: \n' + stdout).to.contain('running');
        done();
      });
    }.bind(this));
  });

  it('copies procfile and manifest files with blank route name', function (done) {
    var mockPromptOptions = {
      routeName: '',
      apiEndpoint: ''
    };
    generatorTest('cloudfoundry', 'cf-test', mockPromptOptions, function () {
      helpers.assertFile([
        'dist/Procfile',
        'dist/manifest.yml'
      ]);
      exec('cf app ' + this.appname, function (error, stdout, stderr) {
        if (error) {
          console.log(error);
          console.log(stderr);
        }
        gen.log(stdout);
        expect(stdout, 'App failed to start: \n' + stdout).to.contain('running');
        done();
      });
    }.bind(this));
  });

  it('copies procfile and manifest files with specific apiendpoint', function (done) {
    var mockPromptOptions = {
      routeName: '',
      apiEndpoint: 'api.run.pivotal.io'
    };
    generatorTest('cloudfoundry', 'cf-test', mockPromptOptions, function () {
      helpers.assertFile([
        'dist/Procfile',
        'dist/manifest.yml'
      ]);
      exec('cf app ' + this.appname, function (error, stdout, stderr) {
        if (error) {
          console.log(error);
          console.log(stderr);
        }
        gen.log(stdout);
        expect(stdout, 'App failed to start: \n' + stdout).to.contain('running');
        done();
      });
    }.bind(this));
  });

});
