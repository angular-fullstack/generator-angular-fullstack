/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-extra');
var exec = require('child_process').exec;

describe('angular-fullstack generator', function () {
  var gen, defaultOptions = {
    script: 'js',
    markup: 'html',
    stylesheet: 'sass',
    router: 'uirouter',
    mongoose: false,
    auth: false,
    oauth: [],
    socketio: false
  };

  beforeEach(function (done) {
    this.timeout(10000);
    var deps = [
      '../../app',
      [
        helpers.createDummyGenerator(),
        'ng-component:app'
      ]
    ];

    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      gen = helpers.createGenerator('angular-fullstack:app', deps);
      gen.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it.only('should generate expected files', function (done) {
    helpers.mockPrompt(gen, defaultOptions);

    gen.run({}, function () {
      helpers.assertFile([
        'client/.htaccess',
        'client/favicon.ico',
        'client/robots.txt',
        'client/app/main/main.scss',
        'client/app/main/main.html',
        'client/index.html',
        'client/.jshintrc',
        'client/assets/images/yeoman.png',
        '.bowerrc',
        '.editorconfig',
        '.gitignore',
        'Gruntfile.js',
        'package.json',
        'bower.json',
        'server/app.js',
        'server/express.js',
        'server/api/thing/index.js']);
      done();
    });
  });

  describe('running app', function() {
    beforeEach(function() {
      this.timeout(20000);
      fs.copySync(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
      fs.copySync(__dirname +'/fixtures/bower_components', __dirname +'/temp/client/bower_components');
    });

    describe('with default options', function() {
      beforeEach(function() {
        helpers.mockPrompt(gen, defaultOptions);
      });

      it('should run client tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:client', function (error, stdout, stderr) {
            expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
            done();
          });
        });
      });

      it('should run server tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:server', function (error, stdout, stderr) {
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            done();
          });
        });
      });

//      it('should run e2e tests successfully', function(done) {
//        this.timeout(80000);
//        gen.run({}, function () {
//          exec('npm run update-webdriver', function (error, stdout, stderr) {
//            exec('grunt e2e', function (error, stdout, stderr) {
//              expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
//              done();
//            });
//          });
//        })
//      });
    });

    describe('with other preprocessors', function() {
      beforeEach(function() {
        helpers.mockPrompt(gen, {
          script: 'coffee',
          markup: 'jade',
          stylesheet: 'less',
          router: 'uirouter',
          mongoose: true,
          auth: true,
          oauth: [],
          socketio: true
        });
      });

      it('should run client tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:client', function (error, stdout, stderr) {
            expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
            done();
          });
        });
      });

      it('should run server tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:server', function (error, stdout, stderr) {
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            done();
          });
        });
      });
    });

    describe('with other preprocessors and no server options', function() {
      beforeEach(function() {
        helpers.mockPrompt(gen, {
          script: 'coffee',
          markup: 'jade',
          stylesheet: 'less',
          router: 'ngroute',
          mongoose: false,
          auth: false,
          oauth: [],
          socketio: false
        });
      });

      it('should run client tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:client', function (error, stdout, stderr) {
            expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
            done();
          });
        });
      });

      it('should run server tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:server', function (error, stdout, stderr) {
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            done();
          });
        });
      });
    });

    describe('with no preprocessors and all server options', function() {
      beforeEach(function() {
        helpers.mockPrompt(gen, {
          script: 'js',
          markup: 'html',
          stylesheet: 'css',
          router: 'ngroute',
          mongoose: true,
          auth: true,
          oauth: [],
          socketio: true
        });
      });

      it('should run client tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:client', function (error, stdout, stderr) {
            expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
            done();
          });
        });
      });

      it('should run server tests successfully', function(done) {
        this.timeout(60000);
        gen.run({}, function () {
          exec('grunt test:server', function (error, stdout, stderr) {
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            done();
          });
        });
      });

    });
  });
});