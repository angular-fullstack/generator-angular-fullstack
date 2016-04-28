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

export function getConfig(path) {
  return fs.readFileAsync(path, 'utf8').then(data => {
    return JSON.parse(data);
  });
}
