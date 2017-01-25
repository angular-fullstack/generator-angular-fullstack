'use strict';
import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import minimatch from 'minimatch';
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  readJSON,
  runGen
} from './test-helpers';

const TEST_DIR = __dirname;

const defaultOptions = {
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

function runEndpointGen(name, opt={}) {
  let prompts = opt.prompts || {};
  let options = opt.options || {};
  let config = opt.config;

  return new Promise((resolve, reject) => {
    let dir;
    let gen = helpers
      .run(require.resolve('../generators/endpoint'))
      .inTmpDir(function(_dir) {
        // this will create a new temporary directory for each new generator run
        var done = this.async();
        if(DEBUG) console.log(`TEMP DIR: ${_dir}`);
        dir = _dir;

        // symlink our dependency directories
        return fs.symlinkAsync(__dirname + '/fixtures/node_modules', dir + '/node_modules')
          .then(done);
      })
      .withOptions(options)
      .withArguments([name])
      .withPrompts(prompts);

    if(config) {
      gen
        .withLocalConfig(config);
    }

    gen
      .on('error', reject)
      .on('end', () => resolve(dir));
  });
}

const ESLINT_CMD = path.join(TEST_DIR, '/fixtures/node_modules/.bin/eslint');

/**
 * @param {string[]} files
 * @param {string} [flags]
 */
function eslintFiles(files, flags = '') {
  return runCmd(`${ESLINT_CMD} ${flags} ${files.join(' ')}`);
}

function eslintDir(dir, name, folder) {
  if(!folder) folder = name;
  let endpointDir = path.join(dir, 'server/api', folder);
  let files = fs.readdirAsync(endpointDir);

  let regFiles = files
    .then(files => files.filter(file => minimatch(file, '**/!(*.spec|*.mock|*.integration).js', {dot: true})))
    .then(files => files.map(file => path.join('./server/api/', folder, file)));

  let specFiles = files
    .then(files => files.filter(file => minimatch(file, '**/+(*.spec|*.mock|*.integration).js', {dot: true})))
    .then(files => files.map(file => path.join('./server/api/', folder, file)));

  let regLint = regFiles.then(files => eslintFiles(files));

  let specLint = specFiles.then(files => eslintFiles(files, '--env node,es6,mocha --global sinon,expect'));

  return Promise.all([regLint, specLint]);
}

var config;
var genDir;

describe('angular-fullstack:endpoint', function() {
  before(function() {
    return Promise.all([
      runGen(defaultOptions).then(_dir => {
        genDir = _dir;
      }),
      readJSON(path.join(TEST_DIR, 'fixtures/.yo-rc.json')).then(_config => {
        _config['generator-angular-fullstack'].insertRoutes = false;
        _config['generator-angular-fullstack'].pluralizeRoutes = false;
        _config['generator-angular-fullstack'].insertSockets = false;
        _config['generator-angular-fullstack'].insertModels = false;
        config = _config;
      })
    ]);
  });

  describe(`with a generated endpoint 'foo'`, function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('foo', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/.eslintrc'), './.eslintrc'),
          copyAsync(path.join(genDir, '/server/.eslintrc'), './server/.eslintrc')
        ]);
      });
    });

    it('should generate the expected files', function() {
      assert.file(getExpectedFiles.endpoint('foo'));
    });

    it('should pass lint', function() {
      return eslintDir(dir, 'foo').should.be.fulfilled();
    });
  });

  describe('with a generated capitalized endpoint', function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('Foo', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/.eslintrc'), './.eslintrc'),
          copyAsync(path.join(genDir, '/server/.eslintrc'), './server/.eslintrc')
        ]);
      });
    });

    it('should generate the expected files', function() {
      assert.file(getExpectedFiles.endpoint('Foo'));
    });

    it('should pass lint', function() {
      return eslintDir(dir, 'Foo').should.be.fulfilled();
    });
  });

  describe('with a generated path name endpoint', function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('foo/bar', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/.eslintrc'), './.eslintrc'),
          copyAsync(path.join(genDir, '/server/.eslintrc'), './server/.eslintrc')
        ]);
      });
    });

    it('should generate the expected files', function() {
      assert.file(getExpectedFiles.endpoint('bar', 'foo/bar'));
    });

    it('should pass lint', function() {
      return eslintDir(dir, 'foo', 'foo/bar').should.be.fulfilled();
    });
  });

  describe('with a generated snake-case endpoint', function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('foo-bar', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/.eslintrc'), './.eslintrc'),
          copyAsync(path.join(genDir, '/server/.eslintrc'), './server/.eslintrc')
        ]);
      });
    });

    it('should generate the expected files', function() {
      assert.file(getExpectedFiles.endpoint('foo-bar'));
    });

    it('should pass lint', function() {
      return eslintDir(dir, 'foo-bar').should.be.fulfilled();
    });
  });
});
