'use strict';
import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import _ from 'lodash';
import {exec, fork} from 'child_process';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import minimatch from 'minimatch';
import recursiveReadDir from 'recursive-readdir';
import Checker from 'jscs';
const jscs = new Checker();
jscs.registerDefaultRules();

const TEST_DIR = __dirname;
const DEBUG = process.env.DEBUG || false;

/**
 * Copy file from src to dest
 * @param {string} src
 * @param {string} dest
 * @returns {Promise}
 */
export function copyAsync(src, dest) {
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
 * @param {Object} [options={}]
 * @returns {Promise}
 */
export function runCmd(cmd, options={}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, function(err, stdout, stderr) {
      if(err) {
        console.error(stdout);
        return reject(err);
      } else {
        if(DEBUG) console.log(`${cmd} stdout: ${stdout}`);
        return resolve(stdout);
      }
    });
  });
}

/**
 * Assert that only the expected files are present
 * @param {string[]} expectedFiles - array of expected files
 * @param {string} [topLevelPath='./'] - root dir of expected files to recursively search
 * @param {string[]} [skip=['node_modules','bower_components']] - files/folders recursiveReadDir should skip
 * @returns {Promise}
 */
export function assertFiles(expectedFiles, topLevelPath='./', skip=['node_modules', 'bower_components']) {
  return new Promise((resolve, reject) => {
    recursiveReadDir(topLevelPath, skip, function(err, actualFiles) {
      if(err) return reject(err);

      actualFiles = _.map(actualFiles.concat(), file => path.normalize(file.replace(path.normalize(`${topLevelPath}/`), '')));
      expectedFiles = _.map(expectedFiles, file => path.normalize(file));

      let missing = _.difference(expectedFiles, actualFiles).map(extra => `- ${extra}`);
      let extras = _.pullAll(actualFiles, expectedFiles).map(extra => `+ ${extra}`);
      let errors = missing.concat(extras);

      if(errors.length !== 0) {
        return reject(errors);
      }
      resolve();
    });
  });
}

/**
 * Read JSON from a file
 * @param {string} path
 * @returns {Promise} - parsed JSON
 */
export function readJSON(path) {
  return fs.readFileAsync(path, 'utf8').then(data => {
    return JSON.parse(data);
  });
}

/**
 * Run angular-fullstack:app
 * @param {String} [name]
 * @param {object} [prompts]
 * @param {object} [opts={}]
 * @param {boolean} [opts.copyConfigFile] - copy default .yo-rc.json
 * @returns {Promise}
 */
export function runGen(name='test', opts={}) {
  let prompts = opts.prompts || {};
  let options = opts.options || {skipInstall: true};
  // let config = opts.config;

  // let dir;
  let gen = helpers
    .run(require.resolve('../generators/app'))
    .inTmpDir(function(dir) {
      // this will create a new temporary directory for each new generator run
      var done = this.async();
      if(DEBUG) console.log(`TEMP DIR: ${dir}`);

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
    .withArguments([name])
    .withOptions(options);

  if(prompts) gen.withPrompts(prompts);

  return gen.toPromise();
}

/**
 * @param {String} name
 * @param {Object} [opt={}]
 * @param {Object} [opt.prompts={}] - prompt answers
 * @param {Object} [opt.options={}]
 * @param {Object} [opt.config] - .yo-rc.json config
 * @param {Boolean} [opt.tmpdir] - whether to run in cwd or a tmp dir
 */
export function runEndpointGen(name, opt={}) {
  let prompts = opt.prompts || {};
  let options = opt.options || {};
  let config = opt.config;
  let tmpdir = !!opt.tmpdir;

  let gen = helpers
    .run(require.resolve('../generators/endpoint'), {tmpdir})
    .withOptions(options)
    .withArguments([name])
    .withPrompts(prompts);

  if(tmpdir) {
    gen.inTmpDir(function(dir) {
      // this will create a new temporary directory for each new generator run
      var done = this.async();
      if(DEBUG) console.log(`TEMP DIR: ${dir}`);

      // symlink our dependency directories
      return Promise.all([
        fs.mkdirAsync(dir + '/client').then(() => {
          return fs.symlinkAsync(__dirname + '/fixtures/bower_components', dir + '/client/bower_components');
        }),
        fs.symlinkAsync(__dirname + '/fixtures/node_modules', dir + '/node_modules')
      ]).then(done);
    });
  }

  if(config) {
    gen
      .withLocalConfig(config);
  }

  return gen.toPromise();
}

// Yeoman generators rely on the current process's current working directory.
// In order to allow multiple generators to be run in parallel, we need to run each gen in a separate child process.

/**
 * Run angular-fullstack:app in a forked child process
 * @param {String} [name]
 * @param {object} [options={}]
 * @returns {Promise}
 */
export function runGenForked(name, options={}) {
  let child = fork(path.resolve('./gen.app.js'), [name, JSON.stringify(options)]);

  return new Promise((resolve, reject) => {
    child.on('message', msg => {
      child.kill();
      resolve(msg);
    });
    child.on('error', err => {
      child.kill();
      reject(err);
    });
    // child.on('disconnect', () => console.log('RIP'));
  });
}

/**
 * Run angular-fullstack:app in a forked child process
 * @param {String} name
 * @param {object} options
 * @param {String} dir
 * @returns {Promise}
 */
export function runEndpointGenForked(name, options, dir) {
  let child = fork(path.resolve('./gen.endpoint.js'), [
    name,
    JSON.stringify(options),
    dir
  ]);

  return new Promise((resolve, reject) => {
    child.on('message', msg => {
      child.kill();
      resolve(msg);
    });
    child.on('error', err => {
      child.kill();
      reject(err);
    });
    // child.on('disconnect', () => console.log('RIP'));
  });
}

let jshintCmd = path.join(TEST_DIR, '/fixtures/node_modules/.bin/jshint');
function testFile(command, _path, options) {
  _path = path.normalize(_path);
  return fs.accessAsync(_path, fs.R_OK).then(() => {
    return runCmd(`${command} ${_path}`, options);
  });
}

export function jshintDir(dir, name, folder) {
  if(!folder) folder = name;
  let endpointDir = path.normalize(path.join(dir, 'server/api', folder));

  let regFiles = fs.readdirAsync(endpointDir)
    .then(files => files.filter(file => minimatch(file, '**/!(*.spec|*.mock|*.integration).js', {dot: true})))
    .map(file => testFile(jshintCmd, path.join(endpointDir, file), {cwd: dir}));

  let specFiles = fs.readdirAsync(endpointDir)
    .then(files => files.filter(file => minimatch(file, '**/+(*.spec|*.mock|*.integration).js', {dot: true})))
    .map(file => testFile(`${jshintCmd} --config server/.jshintrc-spec`, path.join(endpointDir, file), {cwd: dir}));

  return Promise.all([regFiles, specFiles]);
}
export function jscsDir(dir, name, folder) {
  if(!folder) folder = name;
  let endpointDir = path.join(dir, 'server/api', folder);

  return fs.readdirAsync(endpointDir).then(files => {
    return Promise.map(files, file => {
      return fs.readFileAsync(path.join(endpointDir, file), 'utf8').then(data => {
        let results = jscs.checkString(data)
        let errors = results.getErrorList();
        if(errors.length === 0) {
          return Promise.resolve();
        } else {
          errors.forEach(error => {
            var colorizeOutput = true;
            console.log(results.explainError(error, colorizeOutput) + '\n');
          });
          return Promise.reject();
        }
      });
    });
  });
}
