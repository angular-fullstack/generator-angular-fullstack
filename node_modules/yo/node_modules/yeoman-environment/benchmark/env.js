/*global suite, bench */
'use strict';
var generators = require('..');

suite('Env', function () {
  bench('#lookup()', function () {
    generators().lookup();
  });
});
