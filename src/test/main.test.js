'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import {exec} from 'child_process';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import * as getExpectedFiles from './get-expected-files';
import recursiveReadDir from 'recursive-readdir';

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
const TEST_DIR = __dirname;

function copyAsync(src, dest) {
  return fs.readFileAsync(src)
    .then(data => fs.writeFileAsync(dest, data));
}

/**
 * @callback doneCallback
 * @param {null|Error} err
 */

/**
 * Run the given command in a child process
 * @param {string} cmd - command to run
 * @param {doneCallback} done
 */
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

function assertOnlyFiles(expectedFiles, topLevelPath='./', skip=['node_modules', 'bower_components']) {
  return new Promise((resolve, reject) => {
    recursiveReadDir(topLevelPath, skip, function(err, actualFiles) {
      if(err) return reject(err);

      actualFiles = _.map(actualFiles.concat(), file => path.normalize(file.replace(path.normalize(`${topLevelPath}/`), '')));
      expectedFiles = _.map(expectedFiles, file => path.normalize(file));

      let extras = _.pullAll(actualFiles, expectedFiles);

      if(extras.length !== 0) {
        return reject(extras);
      }
      resolve();
    });
  });
}

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

function getConfig(dir) {
  return fs.readFileAsync(path.join(dir, '.yo-rc.json'), 'utf8').then(data => {
    return JSON.parse(data);
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

    it('passes JSCS', function(done) {
      runCmd('grunt jscs', done);
    });

    it('passes JSHint', function(done) {
      runCmd('grunt jshint', done);
    });

    it('passes client tests', function(done) {
      runCmd('grunt test:client', done);
    });

    it('passes server tests', function(done) {
      runCmd('grunt test:server', done);
    });

    describe('with a generated endpont', function() {
      beforeEach(function() {
        getConfig(dir).then(config => {
          return runEndpointGen('foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should pass jscs'); //'foo'

      it('should pass lint');

      it('should run server tests successfully', function(done) {
        runCmd('grunt test:server', done);
      });
    });

    describe('with a generated capitalized endpont', function() {
      beforeEach(function() {
        getConfig(dir).then(config => {
          return runEndpointGen('Foo', {config: config['generator-angular-fullstack']});
        });
      });

      it('should pass jscs');

      it('should pass lint');

      it('should run server tests successfully', function(done) {
        runCmd('grunt test:server', done);
      });
    });

    it('should pass lint with generated path name endpoint'); //'foo/bar'

    it('should run server tests successfully with generated path name endpoint');

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