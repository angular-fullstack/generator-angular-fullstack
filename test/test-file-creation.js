/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-extra');
var exec = require('child_process').exec;

describe('angular-fullstack generator', function () {
  var gen;

  beforeEach(function (done) {
    this.timeout(10000);
    var deps = [
      '../../app'
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

  it('should generate dotfiles', function (done) {
    helpers.mockPrompt(gen, {
    });

    gen.run({}, function () {
      helpers.assertFile(['.gitignore']);
      done();
    });
  });
});

describe('running app', function() {
  before(function() {
    this.timeout(20000);
    fs.copySync(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
    fs.copySync(__dirname +'/fixtures/bower_components', __dirname +'/temp/client/bower_components');
  });

  it('should run client tests successfully', function(done) {
    this.timeout(60000);
    exec('grunt test:client', function (error, stdout, stderr) {
      expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
      done();
    });
  });

  it('should run server tests successfully', function(done) {
    this.timeout(60000);
    exec('grunt test:server', function (error, stdout, stderr) {
      expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
      done();
    });
  });
});
