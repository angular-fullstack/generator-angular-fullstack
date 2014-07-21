'use strict';
var markdown = require('marked');
var semver = require('semver');

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        versionFile: 'package.json'
      }
    },
    release: {
      options: {
        commitMessage: '<%= version %>',
        tagName: 'v<%= version %>',
        bump: false, // we have our own bump
        file: 'package.json'
      }
    },
    stage: {
      options: {
        files: ['CHANGELOG.md']
      }
    },
    jshint: {
      options: {
        curly: false,
        node: true
      },
      all: ['Gruntfile.js', '*/index.js']
    }
  });

  grunt.registerTask('bump', 'bump manifest version', function (type) {
    var options = this.options({
      file: grunt.config('pkgFile') || 'package.json'
    });

    function setup(file, type) {
      var pkg = grunt.file.readJSON(file);
      var newVersion = pkg.version = semver.inc(pkg.version, type || 'patch');
      return {
        file: file,
        pkg: pkg,
        newVersion: newVersion
      };
    }

    var config = setup(options.file, type);
    grunt.file.write(config.file, JSON.stringify(config.pkg, null, '  ') + '\n');
    grunt.log.ok('Version bumped to ' + config.newVersion);
  });

  grunt.registerTask('stage', 'git add files before running the release task', function () {
    var files = this.options().files;
    grunt.util.spawn({
      cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
      args: ['add'].concat(files)
    }, grunt.task.current.async());
  });

  //grunt.registerTask('default', ['bump', 'changelog', 'stage', 'release']);
};
