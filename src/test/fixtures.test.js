'use strict';
import path from 'path';
import assert from 'yeoman-assert';
import test from 'ava';

async function macro(t, command) {
  return command(t);
}
macro.title = (providedTitle, command, endpoint) => {
  if(!providedTitle) throw new Error('You need to provide a title for this test');

  return `fixtures | ${providedTitle}`.trim();
}

test('package.json', macro, t => {
  assert.file([path.join(__dirname, 'fixtures/package.json')]);
});

test('.bowerrc & bower.json', macro, t => {
  assert.file([path.join(__dirname, 'fixtures/bower.json'), path.join(__dirname, 'fixtures/.bowerrc')]);
});

test('.yo-rc.json', macro, t => {
  assert.file([path.join(__dirname, 'fixtures/.yo-rc.json')]);
});

test('.yo-rc.json', macro, t => {
  assert.file([path.join(__dirname, 'fixtures/.yo-rc.json')]);
});

test('node_modules', macro, t => {
  var packageJson = require('./fixtures/package.json');
  var deps = Object.keys(packageJson.dependencies);
  deps = deps.concat(Object.keys(packageJson.devDependencies));
  deps = deps.map(function(dep) {
    return path.join(__dirname, 'fixtures', 'node_modules', dep);
  });
  assert.file(deps);
});

test('bower_components', macro, t => {
  var bowerJson = require('./fixtures/bower.json');
  var deps = Object.keys(bowerJson.dependencies);
  deps = deps.concat(Object.keys(bowerJson.devDependencies));
  deps = deps.map(function(dep) {
    return path.join(__dirname, 'fixtures', 'bower_components', dep);
  });
  assert.file(deps);
});
