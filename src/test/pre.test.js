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

describe('test fixtures', function() {
  it('should have package.json in fixtures', function() {
    assert.file([path.join(__dirname, 'fixtures', 'package.json')]);
  });

  it('should have bower.json in fixtures', function() {
    assert.file([path.join(__dirname, 'fixtures', 'bower.json')]);
  });

  it('should have all npm packages in fixtures/node_modules', function() {
    var packageJson = require('./fixtures/package.json');
    var deps = Object.keys(packageJson.dependencies);
    deps = deps.concat(Object.keys(packageJson.devDependencies));
    deps = deps.map(function(dep) {
      return path.join(__dirname, 'fixtures', 'node_modules', dep);
    });
    assert.file(deps);
  });

  it('should have all bower packages in fixtures/bower_components', function() {
    var bowerJson = require('./fixtures/bower.json');
    var deps = Object.keys(bowerJson.dependencies);
    deps = deps.concat(Object.keys(bowerJson.devDependencies));
    deps = deps.map(function(dep) {
      return path.join(__dirname, 'fixtures', 'bower_components', dep);
    });
    assert.file(deps);
  });
});