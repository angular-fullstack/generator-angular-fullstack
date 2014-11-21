'use strict';

var assert = require('assert');
var taketalk = require('./');

describe('taketalk', function () {
  it('should only take an object', function () {
    [undefined, null, 0, '', function () {}].
      forEach(function (arg) {
        assert.throws(function () {
          taketalk(arg);
        }, Error, 'Expected an object.');
      });

    taketalk({});
  });
});
