'use strict';

var shell = require('shelljs');
var child_process = require('child_process');
var Q = require('q');
var helpers = require('yeoman-test');
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  var gruntUtils = require('./task-utils/grunt')(grunt);
  var gitCmd = gruntUtils.gitCmd;
  var gitCmdAsync = gruntUtils.gitCmdAsync;

  grunt.initConfig({
    config: {
      demo: 'demo'
    },
    pkg: grunt.file.readJSON('package.json'),
    release: {
      options: {
        commitMessage: '<%= version %>',
        tagName: '<%= version %>',
        file: 'package.json',
        beforeBump: ['updateSubmodules'],
        afterBump: ['updateFixtures:deps', 'commitNgFullstackDeps'],
        beforeRelease: ['stage'],
        push: false,
        pushTags: false,
        npm: false
      }
    },
    stage: {
      options: {
        files: ['CHANGELOG.md', 'angular-fullstack-deps']
      }
    },
    buildcontrol: {
      options: {
        dir: 'demo',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built using Angular Fullstack v<%= pkg.version %> from commit %sourceCommit%'
      },
      release: {
        options: {
          remote: 'origin',
          branch: 'master'
        }
      }
    },
    david: {
      gen: {
        options: {}
      },
      app: {
        options: {
          package: 'test/fixtures/package.json'
        }
      }
    }
  });

  grunt.registerTask('stage', 'git add files before running the release task', function () {
    var files = grunt.config('stage.options').files;
    gitCmd(['add'].concat(files), {}, this.async());
  });

  grunt.registerTask('commitNgFullstackDeps', function() {
    grunt.config.requires(
      'commitNgFullstackDeps.options.files',
      'commitNgFullstackDeps.options.cwd'
    );
    var ops = grunt.config.get('commitNgFullstackDeps').options;
    var version = require('./package.json').version || 'NO VERSION SET';
    if (Array.isArray(ops.files) && ops.files.length > 0) {
      gitCmd(['commit', '-m', version].concat(ops.files), {
        cwd: path.resolve(__dirname, ops.cwd)
      }, this.async());
    } else {
      grunt.log.writeln('No files were commited');
    }
  });

  grunt.registerTask('generateDemo', 'generate demo', function () {
    var done = this.async();

    shell.mkdir(grunt.config('config').demo);
    shell.cd(grunt.config('config').demo);

    Q()
      .then(generateDemo)
      .then(function() {
        shell.cd('../');
      })
      .catch(function(msg){
        grunt.fail.warn(msg || 'failed to generate demo')
      })
      .finally(done);

    function generateDemo() {
      var deferred = Q.defer();
      var options = {
        script: 'js',
        markup: 'html',
        stylesheet: 'sass',
        router: 'uirouter',
        bootstrap: true,
        uibootstrap: true,
        mongoose: true,
        testing: 'jasmine',
        auth: true,
        oauth: ['googleAuth', 'twitterAuth'],
        ws: true
      };

      var deps = [
        '../app',
        [
          helpers.createDummyGenerator(),
          'ng-component:app'
        ]
      ];

      var gen = helpers.createGenerator('angular-fullstack:app', deps);

      helpers.mockPrompt(gen, options);
      gen.run({}, function () {
        deferred.resolve();
      });

      return deferred.promise;
    }
  });

  grunt.registerTask('releaseDemoBuild', 'builds and releases demo', function () {
    var done = this.async();

    shell.cd(grunt.config('config').demo);

    Q()
      .then(gruntBuild)
      .then(gruntRelease)
      .then(function() {
        shell.cd('../');
      })
      .catch(function(msg){
        grunt.fail.warn(msg || 'failed to release demo')
      })
      .finally(done);

    function run(cmd) {
      var deferred = Q.defer();
      var generator = shell.exec(cmd, {async:true});
      generator.stdout.on('data', function (data) {
        grunt.verbose.writeln(data);
      });
      generator.on('exit', function (code) {
        deferred.resolve();
      });

      return deferred.promise;
    }

    function gruntBuild() {
      return run('grunt');
    }

    function gruntRelease() {
      return run('grunt buildcontrol:heroku');
    }
  });

  grunt.registerTask('deps', function(target) {
    if (!target || target === 'app') grunt.task.run(['updateFixtures']);
    grunt.task.run(['david:' + (target || '')]);
  });

  grunt.registerTask('demo', [
    'clean:demo',
    'generateDemo'
  ]);

  grunt.registerTask('releaseDemo', [
    'demo',
    'releaseDemoBuild',
    'buildcontrol:release'
  ]);

  //grunt.registerTask('default', ['bump', 'changelog', 'stage', 'release']);
};
