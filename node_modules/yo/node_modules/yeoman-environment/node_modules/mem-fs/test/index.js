'use strict';

var assert = require('assert');
var path = require('path');
var File = require('vinyl');

var memFs = require('..');

var fixtureA = 'fixtures/file-a.txt';
var fixtureB = 'fixtures/file-b.txt';
var absentFile = 'fixture/does-not-exist.txt';
var coffeeFile = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.coffee',
  contents: new Buffer('test = 123')
});

describe('mem-fs', function () {
  beforeEach(function() {
    process.chdir(__dirname);
    this.store = memFs.create();
  });

  describe('#get() / #add()', function () {
    it('load file from disk', function () {
      var file = this.store.get(fixtureA);
      assert.equal(file.contents.toString(), 'foo\n');
      assert.equal(file.cwd, process.cwd());
      assert.equal(file.path, path.resolve(fixtureA));
    });

    it('get/modify/add a file', function () {
      var file = this.store.get(fixtureA);
      file.contents = new Buffer('bar');
      this.store.add(file);
      var file2 = this.store.get(fixtureA);
      assert.equal(file2.contents.toString(), 'bar');
    });

    it('retrive file from memory', function () {
      this.store.add(coffeeFile);
      var file = this.store.get('/test/file.coffee');
      assert.equal(file.contents.toString(), 'test = 123');
    });

    it('returns empty file reference if file does not exist', function () {
      var file = this.store.get(absentFile);
      assert.equal(file.contents, null);
      assert.equal(file.path, path.resolve(absentFile));
    });
  });

  describe('#add()', function () {
    it('is chainable', function () {
      assert.equal(this.store.add(coffeeFile), this.store);
    });
  });

  describe('#each()', function () {
    beforeEach(function() {
      this.store.get(fixtureA);
      this.store.get(fixtureB);
    });

    it('iterates over every file', function () {
      var files = [fixtureA, fixtureB];
      this.store.each(function (file, index) {
        assert.equal(path.resolve(files[index]), file.path);
      });
    });

    it('is chainable', function () {
      assert.equal(this.store.each(function () {}), this.store);
    });
  });

  describe('#stream()', function () {
    beforeEach(function() {
      this.store.get(fixtureA);
      this.store.get(fixtureB);
    });

    it('returns an object stream for each file contained', function (done) {
      var index = 0;
      var files = [fixtureA, fixtureB];
      var stream = this.store.stream()

      stream.on('data', function (file) {
        assert.equal(path.resolve(files[index]), file.path);
        index++;
      });

      stream.on('end', function () {
        assert.equal(index, 2);
        done();
      });
    });
  });
});
