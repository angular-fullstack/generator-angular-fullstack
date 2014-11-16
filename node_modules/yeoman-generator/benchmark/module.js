/*global suite, bench */
'use strict';

suite('yeoman-generator module', function () {
  bench('require', function () {
    require('..');
    delete require.cache[require.resolve('..')];
  });
});
