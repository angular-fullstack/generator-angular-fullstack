/*!
 * is-absolute <https:\\github.com/jonschlinkert/is-absolute>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var assert = require('assert');
var isAbsolute = require('./');

describe('isAbsolute()', function () {
  it('should support node.js', function () {
    assert(isAbsolute(__dirname));
    assert(isAbsolute(__filename));
    assert(isAbsolute(path.join(process.cwd())));
    assert(isAbsolute(path.resolve(process.cwd(), 'README.md')));
    assert(!isAbsolute(path.relative(process.cwd(), 'README.md')));
  });

  it('should work with glob patterns', function () {
    assert(isAbsolute(path.join(process.cwd(), 'pages/*.txt')));
    assert(!isAbsolute('pages/*.txt'));
  });

  it('should support windows', function () {
    assert(isAbsolute('c:\\'));
    assert(isAbsolute('//C://user\\docs\\Letter.txt'));
    assert(!isAbsolute(':\\'));
    assert(!isAbsolute('foo\\bar\\baz'));
    assert(!isAbsolute('foo\\bar\\baz\\'));
  });

  it('should support windows unc', function () {
    assert(isAbsolute('\\\\foo\\bar'))
    assert(isAbsolute('//UNC//Server01//user//docs//Letter.txt'));
  });

  it('should support unices', function () {
    assert(isAbsolute('/foo/bar'));
    assert(!isAbsolute('foo/bar'));
    assert(isAbsolute('/user/docs/Letter.txt'));
  });
});