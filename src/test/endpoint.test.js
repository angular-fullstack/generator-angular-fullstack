'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import test from 'ava';
import minimatch from 'minimatch';
import Checker from 'jscs';
const jscs = new Checker();
jscs.registerDefaultRules();
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  assertFiles,
  readJSON,
  runGen,
  runGenForked,
  runEndpointGenForked,
  jshintDir,
  jscsDir
} from './test-helpers';

const TEST_DIR = __dirname;
const BASE_PORT = 9100;

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

var config;
var genDir;
var config;
let endpointGenPromises = [];

async function macro(t, command, endpoint) {
  if(global.DEBUG) console.log(t.context.dir);

  if(!endpointGenPromises[endpoint]) {
    endpointGenPromises[endpoint] = runEndpointGenForked(endpoint, {
      config: config['generator-angular-fullstack'],
      tmpdir: true
    }, genDir).then(dir => {
      return Promise.all([
        copyAsync(path.join(genDir, '/server/.jshintrc'), path.join(dir, '/server/.jshintrc')),
        copyAsync(path.join(genDir, '/server/.jshintrc-spec'), path.join(dir, '/server/.jshintrc-spec')),
        copyAsync(path.join(genDir, '/.jscsrc'), path.join(dir, '/server/.jscsrc'))
      ]).then(() => dir);
    });
  }

  t.context.dir = await endpointGenPromises[endpoint];

  if(typeof command === 'string') {
    let basename = endpoint.split('/');
    basename = basename[basename.length - 1];

    switch(command) {
      case 'files':
        const expectedFiles = getExpectedFiles.endpoint(basename);
        const endpointDir = path.normalize(path.join(t.context.dir, 'server/api', endpoint));
        return t.notThrows(assertFiles(expectedFiles, endpointDir).catch(err => {
          console.log(err);
          throw err;
        }));
      case 'lint':
        return t.notThrows(jshintDir(t.context.dir, basename, endpoint));
      case 'jscs':
        return t.notThrows(jscsDir(t.context.dir, basename, endpoint));
      default:
        return t.notThrows(runCmd(command, {cwd: t.context.dir}));
    }
  } else {
    return command(t);
  }
}
macro.title = (providedTitle, command, endpoint) => {
  if(!providedTitle && typeof command === 'function') throw new Error('You need to provide a title for this test');

  return `endpoint | ${endpoint} | ${providedTitle || command}`.trim();
}

test.before('run the generator in a temp dir', async t => {
  genDir = await runGenForked('endpoint', {
    prompts: defaultOptions,
    options: {
      devPort: BASE_PORT,
      debugPort: BASE_PORT + 8,
      prodPort: BASE_PORT + 9,
      skipInstall: true
    }
  });

  config = await readJSON(path.join(TEST_DIR, 'fixtures/.yo-rc.json'));
  config['generator-angular-fullstack'].insertRoutes = false;
  config['generator-angular-fullstack'].pluralizeRoutes = false;
  config['generator-angular-fullstack'].insertSockets = false;
  config['generator-angular-fullstack'].insertModels = false;

  if(global.DEBUG) console.log(`endpoint | gen dir: ${genDir}`);
});

['foo', 'Foo', 'foo/bar', 'foo-bar'].forEach(endpoint => {
  test(macro, 'files', endpoint);
  test(macro, 'jscs', endpoint);
  test(macro, 'lint', endpoint);
});
