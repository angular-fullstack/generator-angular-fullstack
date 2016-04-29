'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import minimatch from 'minimatch';
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  assertOnlyFiles,
  getConfig
} from './test-helpers';

const TEST_DIR = __dirname;

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
    let dir;
    let gen = helpers
      .run(require.resolve('../generators/endpoint'))
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

let jshintCmd = path.join(TEST_DIR, '/fixtures/node_modules/.bin/jshint');
let jscsCmd = path.join(TEST_DIR, '/fixtures/node_modules/gulp-jscs/node_modules/.bin/jscs');
function testFile(command, _path) {
  _path = path.normalize(_path);
  return fs.accessAsync(_path, fs.R_OK).then(() => {
    return runCmd(`${command} ${_path}`);
  });
}

function jshintDir(dir, name, folder) {
  if(!folder) folder = name;
  let endpointDir = path.join(dir, 'server/api', folder);

  let regFiles = fs.readdirAsync(endpointDir)
    .then(files => files.filter(file => minimatch(file, '**/!(*.spec|*.mock|*.integration).js', {dot: true})))
    .map(file => testFile(jshintCmd, path.join('./server/api/', folder, file)));

  let specFiles = fs.readdirAsync(endpointDir)
    .then(files => files.filter(file => minimatch(file, '**/+(*.spec|*.mock|*.integration).js', {dot: true})))
    .map(file => testFile(`${jshintCmd} --config server/.jshintrc-spec`, path.join('./server/api/', folder, file)));

  return Promise.all([regFiles, specFiles]);
}

var config;
var genDir;

before(function() {
  return Promise.all([
    runGen(defaultOptions).then(_dir => {
      genDir = _dir;
    }),
    getConfig(path.join(TEST_DIR, 'fixtures/.yo-rc.json')).then(_config => {
      _config['generator-angular-fullstack'].insertRoutes = false;
      _config['generator-angular-fullstack'].pluralizeRoutes = false;
      _config['generator-angular-fullstack'].insertSockets = false;
      _config['generator-angular-fullstack'].insertModels = false;
      config = _config;
    })
  ]);
});

describe('angular-fullstack:endpoint', function() {
  describe(`with a generated endpont 'foo'`, function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('foo', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/server/.jshintrc'), './server/.jshintrc'),
          copyAsync(path.join(genDir, '/server/.jshintrc-spec'), './server/.jshintrc-spec')
        ]);
      });
    });

    it('should generate the expected files', function() {
      assert.file(getExpectedFiles.endpoint('foo'));
    });

    it('should pass jscs');

    it('should pass lint', function() {
      return jshintDir(dir, 'foo').should.be.fulfilled();
    });
  });

  describe('with a generated capitalized endpont', function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('Foo', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/server/.jshintrc'), './server/.jshintrc'),
          copyAsync(path.join(genDir, '/server/.jshintrc-spec'), './server/.jshintrc-spec')
        ]);
      });
    });

    it('should generate the expected files');

    it('should pass jscs');

    it('should pass lint', function() {
      return jshintDir(dir, 'Foo').should.be.fulfilled();
    });
  });

  describe('with a generated path name endpont', function() {
    var dir;
    beforeEach(function() {
      return runEndpointGen('foo/bar', {config: config['generator-angular-fullstack']}).then(_dir => {
        dir = _dir;

        return Promise.all([
          copyAsync(path.join(genDir, '/server/.jshintrc'), './server/.jshintrc'),
          copyAsync(path.join(genDir, '/server/.jshintrc-spec'), './server/.jshintrc-spec')
        ]);
      });
    });

    it('should generate the expected files');

    it('should pass jscs');

    it('should pass lint', function() {
      return jshintDir(dir, 'foo', 'foo/bar').should.be.fulfilled();
    });
  });
});