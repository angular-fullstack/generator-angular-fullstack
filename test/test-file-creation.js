/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('assert');
var fs = require('fs');

describe('angular-fullstack generator', function () {
  var gen;

  beforeEach(function (done) {
    var deps = [
      '../../app'
    ];

    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      gen = helpers.createGenerator('angular-fullstack:app', deps);
      gen.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('should generate dotfiles', function (done) {
    helpers.mockPrompt(gen, {
    });

    gen.run({}, function () {
      helpers.assertFile(['.gitignore']);
      done();
    });
  });
});
