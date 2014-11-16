/**
 * is-relative <https://github.com/jonschlinkert/is-relative>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var isRelative = require('./');

describe('isRelative', function() {
  it('should return true if the path appears to be relative', function() {
    assert(isRelative('test/fixtures'));
    assert(isRelative('test/fixtures/'));
    assert(isRelative('test/fixtures/foo.txt'));
    assert(isRelative('./test/fixtures/foo.txt'));
  });

  it('should return false if the path appears to be absolute', function() {
    assert(isRelative('./test/fixtures/foo.txt'));
    assert(!isRelative('/test/fixtures'));
    assert(!isRelative('/test/fixtures/'));
    assert(!isRelative('/test/fixtures/baz.md'));
    assert(!isRelative('e://test/fixtures/'));
    assert(!isRelative('e:/test/fixtures/'));
    assert(!isRelative('\\test\\fixtures\\'));
  });
});
