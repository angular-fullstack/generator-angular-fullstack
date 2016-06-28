'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
import {exec, fork} from 'child_process';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import recursiveReadDir from 'recursive-readdir';

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
 */
export function runEndpointGen(name, opt={}) {
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
