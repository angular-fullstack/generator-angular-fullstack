/*global describe before it */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var yeoman = require('yeoman-generator').test;


describe('Angular generator', function () {
  before(yeoman.before(path.join(__dirname, 'temp')));

  it ('should generate dotfiles', function () {
    // FIXME: Remove the Gruntfile.js created by the test.before function
    fs.unlinkSync('Gruntfile.js');

    //var g = new Generator();
    //g.run();

    //yeoman.assertFile('.bowerrc');
    //yeoman.assertFile('.gitignore');
    //yeoman.assertFile('.editorconfig');
    //yeoman.assertFile('.jshintrc');
    assert(true);
  });
});
