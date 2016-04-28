'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  assertOnlyFiles,
  getConfig
} from './test-helpers';

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
const TEST_DIR = __dirname;

function runGen(prompts) {
  return new Promise((resolve, reject) => {
    let dir;
    helpers
      .run(require.resolve('../generators/app'))
      .inTmpDir(function(_dir) {
        // this will create a new temporary directory for each new generator run
        var done = this.async();
        if(DEBUG) console.log(`TEMP DIR: ${_dir}`);
        dir = _dir;

        // symlink our dependency directories
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
        skipInstall: true
      })
      // .withArguments(['upperCaseBug'])
      .withPrompts(prompts)
      .on('error', reject)
      .on('end', () => resolve(dir));
  });
}

function runEndpointGen(name, opt={}) {
  let prompts = opt.prompts || {};
  let options = opt.options || {};
  let config = opt.config;

  return new Promise((resolve, reject) => {
    let gen = helpers
      .run(require.resolve('../generators/endpoint'), {tmpdir: false})
      .withOptions(options)
      .withArguments([name])
      .withPrompts(prompts);

    if(config) {
      gen
        .withLocalConfig(config);
    }

    gen
      .on('error', reject)
      .on('end', () => resolve())
  });
}

describe('angular-fullstack:app', function() {
  beforeEach(function() {
    this.gen = runGen(defaultOptions);
  });

  describe('default settings', function() {
    var dir;

    beforeEach(function() {
      return this.gen.then(_dir => {
        dir = _dir;
      });
    });

    it('generates the proper files', function() {
      const expectedFiles = getExpectedFiles.app(defaultOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.eventually.be.fulfilled;
    });

    it('passes JSCS', function() {
      return runCmd('grunt jscs').should.be.fulfilled();
    });

    it('passes JSHint', function() {
      return runCmd('grunt jshint').should.be.fulfilled();
    });

    it('passes client tests', function() {
      return runCmd('grunt test:client').should.be.fulfilled();
    });

    it('passes server tests', function() {
      return runCmd('grunt test:server').should.be.fulfilled();
    });

    describe('with a generated endpont', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated capitalized endpont', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('Foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated path name endpont', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo/bar', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    it('should generate expected files with path name endpoint');
    // [
    //   'server/api/foo/bar/index.js',
    //   'server/api/foo/bar/index.spec.js',
    //   'server/api/foo/bar/bar.controller.js',
    //   'server/api/foo/bar/bar.events.js',
    //   'server/api/foo/bar/bar.integration.js',
    //   'server/api/foo/bar/bar.model.js',
    //   'server/api/foo/bar/bar.socket.js'
    // ]

    it('should use existing config if available');
      // this.timeout(60000);
      // return copyAsync(__dirname + '/fixtures/.yo-rc.json', __dirname + '/temp/.yo-rc.json').then(() => {
      //   var gen = helpers.createGenerator('angular-fullstack:app', [
      //     '../../generators/app',
      //     '../../generators/endpoint',
      //     [
      //       helpers.createDummyGenerator(),
      //       'ng-component:app'
      //     ]
      //   ], [], {
      //     skipInstall: true
      //   });
      //   helpers.mockPrompt(gen, {
      //     skipConfig: true
      //   });
      //   gen.run(function () {
      //     assert.file([
      //       'client/app/main/main.less',
      //       'server/auth/google/passport.js'
      //     ]);
      //     done();
      //   });
      // });

    if(!process.env.SKIP_E2E) {
      it('should run e2e tests successfully'); //'grunt test:e2e'

      it('should run e2e tests successfully for production app'); //'grunt test:e2e:prod'
    }
  });
});