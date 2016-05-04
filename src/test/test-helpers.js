'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
import {exec} from 'child_process';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import recursiveReadDir from 'recursive-readdir';

const TEST_DIR = __dirname;

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
 * @returns {Promise}
 */
export function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, {}, function(err, stdout, stderr) {
      if(err) {
        console.error(stdout);
        return reject(err);
      } else {
        if(DEBUG) console.log(`${cmd} stdout: ${stdout}`);
        return resolve();
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
export function assertOnlyFiles(expectedFiles, topLevelPath='./', skip=['node_modules', 'bower_components']) {
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
 * @param {object} [prompts]
 * @param {object} [opts={}]
 * @param {boolean} [opts.copyConfigFile] - copy default .yo-rc.json
 * @returns {Promise}
 */
export function runGen(prompts, opts={}) {
  let options = opts.options || {skipInstall: true};

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
    // .withArguments(['upperCaseBug'])
    .withOptions(options);

  if(prompts) gen.withPrompts(prompts);

  return gen.toPromise();
}