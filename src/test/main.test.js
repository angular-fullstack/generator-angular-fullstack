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

function runGen(prompts, opts={}) {
  let options = opts.options || {skipInstall: true};

  return new Promise((resolve, reject) => {
    let dir;
    let gen = helpers
      .run(require.resolve('../generators/app'))
      .inTmpDir(function(_dir) {
        // this will create a new temporary directory for each new generator run
        var done = this.async();
        if(DEBUG) console.log(`TEMP DIR: ${_dir}`);
        dir = _dir;

        let promises = [
          fs.mkdirAsync(dir + '/client').then(() => {
            return fs.symlinkAsync(__dirname + '/fixtures/bower_components', dir + '/client/bower_components');
          }),
          fs.symlinkAsync(__dirname + '/fixtures/node_modules', dir + '/node_modules')
        ];

        if(opts.copyConfigFile) {
          promises.push(copyAsync(path.join(TEST_DIR, 'fixtures/.yo-rc.json'), path.join(dir, '.yo-rc.json')));
        }

        // symlink our dependency directories
        return Promise.all(promises).then(done);
      })
      .withGenerators([
        require.resolve('../generators/endpoint'),
        // [helpers.createDummyGenerator(), 'ng-component:app']
      ])
      // .withArguments(['upperCaseBug'])
      .withOptions(options);

    if(prompts) gen.withPrompts(prompts);

    gen
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
  describe('default settings', function() {
    var dir;

    beforeEach(function() {
      return runGen(defaultOptions).then(_dir => {
        dir = _dir;
      });
    });

    it('generates the proper files', function() {
      const expectedFiles = getExpectedFiles.app(defaultOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
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

    describe('with a generated endpoint', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated capitalized endpoint', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('Foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated path name endpoint', function() {
      beforeEach(function() {
        getConfig(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo/bar', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    it('should run server tests successfully with generated snake-case endpoint'); //'foo-bar'

    if(!process.env.SKIP_E2E) {
      it('should run e2e tests successfully'); //'grunt test:e2e'

      it('should run e2e tests successfully for production app'); //'grunt test:e2e:prod'
    }
  });

  describe('default settings using existing `.yo-rc.json`', function() {
    var dir;

    beforeEach(function() {
      return runGen(null, {
        copyConfigFile: true,
        options: {
          skipInstall: true,
          skipConfig: true
        }
      }).then(_dir => {
        dir = _dir;
      });
    });

    it('generates the proper files', function() {
      const expectedFiles = getExpectedFiles.app(defaultOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
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
  });
});