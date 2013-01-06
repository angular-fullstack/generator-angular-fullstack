var assert = require("assert");
var Generator = require("../common");
var fs = require("fs");
var path = require("path");
var assert = require("assert");
var yeoman = require('yeoman-generators').test;

describe("Angular generator", function() {
  before(yeoman.before(path.join(__dirname, 'temp')));

  it ("should generate dotfiles", function() {
    // FIXME: Remove the Gruntfile.js created by the test.before function
    fs.unlinkSync("Gruntfile.js");

    var g = new Generator();
    g.run();

    yeoman.assertFile(".bowerrc");
    yeoman.assertFile(".gitignore");
    yeoman.assertFile(".editorconfig");
    yeoman.assertFile(".jshintrc");

  });

});

