'use strict';
import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import {exec} from 'child_process';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import * as getExpectedFiles from './get-expected-files';

const defaultOptions = {
  buildtool: 'grunt',
  script: 'js',
  transpiler: 'babel',
  markup: 'html',
  stylesheet: 'sass',
  router: 'uirouter',
  testing: 'mocha',
  chai: 'expect',
  bootstrap: true,
  uibootstrap: true,
  odms: ['mongoose'],
  auth: true,
  oauth: [],
  socketio: true
};
// var DEBUG = true;
var DEBUG = false;

function runCmd(cmd, done) {
  exec(cmd, {}, function(err, stdout, stderr) {
    if(err) {
      console.error(stdout);
      throw new Error(`Error running command: ${cmd}`);
      done(err);
    } else {
      if(DEBUG) console.log(stdout);
      done();
    }
  });
}

describe('angular-fullstack:app', function() {
  beforeEach(function() {
    this.gen = helpers
      .run(require.resolve('../generators/app'))
      .inTmpDir(function(dir) {
        var done = this.async();
        if(DEBUG) console.log(`TEMP DIR: ${dir}`);

        return Promise.all([
          fs.mkdirAsync(dir + '/client').then(() => {
            return fs.symlinkAsync(__dirname + '/fixtures/bower_components', dir + '/client/bower_components');
          }),
          fs.symlinkAsync(__dirname + '/fixtures/node_modules', dir + '/node_modules')
        ]).then(done);
      })
      .withGenerators([
        require.resolve('../generators/endpoint'),
        // [helpers.createDummyGenerator(), 'ng-component:app']
      ])
      .withOptions({
        skipInstall: true,
        force: true
      })
      // .withArguments(['upperCaseBug'])
      .withPrompts(defaultOptions);
  });

  describe('default settings', function() {
    beforeEach(function(done) {
      this.gen.on('end', done);
    });

    it('generates the proper files', function(done) {
      assert.file(getExpectedFiles.app(defaultOptions));
      done();
    });

    it('passes JSCS', function(done) {
      runCmd('grunt jscs', done);
    });

    it('passes JSHint', function(done) {
      runCmd('grunt jshint', done);
    });

    it('passes client tests', function(done) {
      runCmd('grunt test:client', done);
    });

    it('passes client tests', function(done) {
      runCmd('grunt test:server', done);
    });
  });
});