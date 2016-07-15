'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  assertOnlyFiles,
  readJSON,
  runGen
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
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated capitalized endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('Foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated path name endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo/bar', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    describe('with a generated snake-case endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo-bar', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    if(!process.env.SKIP_E2E) {
      it('should run e2e tests successfully', function() {
        this.retries(2);
        return runCmd('grunt test:e2e').should.be.fulfilled();
      });

      it('should run e2e tests successfully for production app', function() {
        this.retries(2);
        return runCmd('grunt test:e2e:prod').should.be.fulfilled();
      });
    }
  });

  describe('default settings using existing `.yo-rc.json`', function() {
    var dir;
    var jscsResult;
    var lintResult;
    var clientTestResult;
    var serverTestResult;

    before(function() {
      return runGen(null, {
        copyConfigFile: true,
        options: {
          skipInstall: true,
          skipConfig: true
        }
      }).then(_dir => {
        dir = _dir;
        jscsResult = runCmd('grunt jscs');
        lintResult = runCmd('grunt jshint');
        clientTestResult = runCmd('grunt test:client');
        serverTestResult = runCmd('grunt test:server');
      });
    });

    it('generates the proper files', function() {
      const expectedFiles = getExpectedFiles.app(defaultOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
    });

    it('passes JSCS', function() {
      return jscsResult.should.be.fulfilled();
    });

    it('passes JSHint', function() {
      return lintResult.should.be.fulfilled();
    });

    it('passes client tests', function() {
      return clientTestResult.should.be.fulfilled();
    });

    it('passes server tests', function() {
      return serverTestResult.should.be.fulfilled();
    });
  });

  describe('with TypeScript, Jade, Jasmine, LESS, & OAuth', function() {
    var dir;
    var jscsResult;
    var lintResult;
    var clientTestResult;
    var serverTestResult;
    var testOptions = {
      buildtool: 'grunt',
      transpiler: 'ts',
      markup: 'jade',
      stylesheet: 'less',
      router: 'uirouter',
      testing: 'jasmine',
      odms: ['mongoose'],
      auth: true,
      oauth: ['twitterAuth', 'facebookAuth', 'googleAuth'],
      socketio: true,
      bootstrap: true,
      uibootstrap: true
    };

    before(function() {
      return runGen(testOptions).then(_dir => {
        dir = _dir;
        jscsResult = runCmd('grunt jscs');
        lintResult = runCmd('grunt tslint');
        clientTestResult = runCmd('grunt test:client');
        serverTestResult = runCmd('grunt test:server');
      });
    });

    it('should generate the proper files', function() {
      const expectedFiles = getExpectedFiles.app(testOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
    });

    it('passes JSCS', function() {
      return jscsResult.should.be.fulfilled();
    });

    it('passes lint', function() {
      return lintResult.should.be.fulfilled();
    });

    it('should run client tests successfully', function() {
      return clientTestResult.should.be.fulfilled();
    });

    it('should run server tests successfully', function() {
      return serverTestResult.should.be.fulfilled();
    });

    describe('with a generated endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    if(!process.env.SKIP_E2E) {
      it.skip('should run e2e tests successfully', function() {
        this.retries(2);
        return runCmd('grunt test:e2e').should.be.fulfilled();
      });

      it.skip('should run e2e tests successfully for production app', function() {
        this.retries(2);
        return runCmd('grunt test:e2e:prod').should.be.fulfilled();
      });
    }
  });

  describe('with sequelize models, auth', function() {
    var dir;
    var jscsResult;
    var lintResult;
    var clientTestResult;
    var serverTestResult;
    var testOptions = {
      buildtool: 'grunt',
      transpiler: 'babel',
      markup: 'jade',
      stylesheet: 'css',
      router: 'uirouter',
      testing: 'jasmine',
      odms: ['sequelize'],
      auth: true,
      oauth: ['twitterAuth', 'facebookAuth', 'googleAuth'],
      socketio: true,
      bootstrap: true,
      uibootstrap: true
    };
    this.retries(3);  // Sequelize seems to be quite flaky

    beforeEach(function() {
      return runGen(testOptions).then(_dir => {
        dir = _dir;
        jscsResult = runCmd('grunt jscs');
        lintResult = runCmd('grunt jshint');
        clientTestResult = runCmd('grunt test:client');
        serverTestResult = runCmd('grunt test:server');
      });
    });

    it('should generate the proper files', function() {
      const expectedFiles = getExpectedFiles.app(testOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
    });

    it('passes JSCS', function() {
      return jscsResult.should.be.fulfilled();
    });

    it('passes lint', function() {
      return lintResult.should.be.fulfilled();
    });

    it('should run client tests successfully', function() {
      return clientTestResult.should.be.fulfilled();
    });

    it('should run server tests successfully', function() {
      return serverTestResult.should.be.fulfilled();
    });

    describe('with a generated endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    if(!process.env.SKIP_E2E) {
      it.skip('should run e2e tests successfully', function() {
        this.retries(2);
        return runCmd('grunt test:e2e').should.be.fulfilled();
      });

      it.skip('should run e2e tests successfully for production app', function() {
        this.retries(2);
        return runCmd('grunt test:e2e:prod').should.be.fulfilled();
      });
    }
  });

  describe('with TypeScript, Mocha + Chai (should) and no server options', function() {
    var dir;
    var jscsResult;
    var lintResult;
    var clientTestResult;
    var serverTestResult;
    var testOptions = {
      buildtool: 'grunt',
      transpiler: 'ts',
      markup: 'jade',
      stylesheet: 'stylus',
      router: 'uirouter',
      testing: 'mocha',
      chai: 'should',
      odms: [],
      auth: false,
      oauth: [],
      socketio: false,
      bootstrap: false,
      uibootstrap: false
    };

    beforeEach(function() {
      return runGen(testOptions).then(_dir => {
        dir = _dir;
        jscsResult = runCmd('grunt jscs');
        lintResult = runCmd('grunt tslint');
        clientTestResult = runCmd('grunt test:client');
        serverTestResult = runCmd('grunt test:server');
      });
    });

    it('should generate the proper files', function() {
      const expectedFiles = getExpectedFiles.app(testOptions);
      assert.file(expectedFiles);
      return assertOnlyFiles(expectedFiles, path.normalize(dir)).should.be.fulfilled();
    });

    it('passes JSCS', function() {
      return jscsResult.should.be.fulfilled();
    });

    it('passes lint', function() {
      return lintResult.should.be.fulfilled();
    });

    it('should run client tests successfully', function() {
      return clientTestResult.should.be.fulfilled();
    });

    it('should run server tests successfully', function() {
      return serverTestResult.should.be.fulfilled();
    });

    describe('with a generated endpoint', function() {
      beforeEach(function() {
        return readJSON(path.join(dir, '.yo-rc.json')).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should run server tests successfully', function() {
        return runCmd('grunt test:server').should.be.fulfilled();
      });
    });

    if(!process.env.SKIP_E2E) {
      it.skip('should run e2e tests successfully', function() {
        this.retries(2);
        return runCmd('grunt test:e2e').should.be.fulfilled();
      });

      it.skip('should run e2e tests successfully for production app', function() {
        this.retries(2);
        return runCmd('grunt test:e2e:prod').should.be.fulfilled();
      });
    }
  });
});
