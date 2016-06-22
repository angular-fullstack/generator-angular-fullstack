'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import test from 'ava';
import * as getExpectedFiles from './get-expected-files';
import {
  copyAsync,
  runCmd,
  assertOnlyFiles,
  readJSON,
  runGenForked,
  runEndpointGenForked
} from './test-helpers';
import 'should';

const defaultOptions = {
  buildtool: 'gulp',
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
const BASE_PORT = 9000;
const chdir = process.chdir;

let counter = 0;

async function macro(t, command, endpoint) {
  if(global.DEBUG) console.log(t.context.dir);

  if(endpoint) {
    let config = await readJSON(path.join(t.context.dir, '.yo-rc.json'));

    await runEndpointGenForked('foo', {config: config['generator-angular-fullstack']}, t.context.dir);
  }

  if(typeof command === 'string') {
    return t.notThrows(runCmd(command, {cwd: t.context.dir}));
  } else {
    return command(t);
  }
}
macro.title = (providedTitle, command, endpoint) => {
  if(!providedTitle && typeof command === 'function') throw new Error('You need to provide a title for this test');

  let endpointText = endpoint ? `| Endpoint: ${endpoint} ` : '';
  return `app | default ${endpointText}| ${providedTitle || command}`.trim();
}

test.beforeEach('run the generator in a temp dir', async t => {
  t.context.counter = counter++;
  t.context.devPort = BASE_PORT + t.context.counter * 10;
  t.context.debugPort = BASE_PORT + t.context.counter * 10 + 8;
  t.context.prodPort = BASE_PORT + t.context.counter * 10 + 9;
  t.context.name = `default${t.context.counter}`;
  t.context.options = {
    prompts: defaultOptions,
    options: {
      devPort: t.context.devPort,
      debugPort: t.context.debugPort,
      prodPort: t.context.prodPort,
      skipInstall: true
    }
  };

  let dir = await runGenForked(t.context.name, t.context.options);

  t.context.dir = dir;
});

test('generates the proper files', macro, t => {
  const expectedFiles = getExpectedFiles.app(defaultOptions);
  return t.notThrows(assertOnlyFiles(expectedFiles, path.normalize(t.context.dir)));
});
test(macro, 'gulp jscs');
test(macro, 'gulp lint:scripts');
test(macro, 'gulp test:client');
test(macro, 'gulp test:server');

test(macro, 'gulp test:server', 'foo');
test(macro, 'gulp test:server', 'Foo');
test(macro, 'gulp test:server', 'foo/bar');
test(macro, 'gulp test:server', 'foo-bar');

if(!process.env.SKIP_E2E) {
  test(macro, 'gulp test:e2e');
  test.skip(macro, 'gulp test:e2e:prod');
} else {
  test.skip(macro, 'gulp test:e2e');
  test.skip(macro, 'gulp test:e2e:prod');
}
