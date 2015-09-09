'use strict';

var shell = require('shelljs');
var child_process = require('child_process');
var Q = require('q');
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    buildcontrol: 'grunt-build-control',
    changelog: 'grunt-conventional-changelog'
  });

  grunt.initConfig({
    config: {
      demo: 'demo'
    },
    pkg: grunt.file.readJSON('package.json'),
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        versionFile: 'package.json'
      }
    },
    release: {
      options: {
        bump: false, // remove after 3.0.0 release
        commitMessage: '<%= version %>',
        tagName: '<%= version %>',
        file: 'package.json',
        afterBump: ['updateFixtures:deps', 'commitNgFullstackDeps'],
        beforeRelease: ['stage'],
        push: false,
        pushTags: false,
        npm: false
      }
    },
    commitNgFullstackDeps: {
      options: {
        cwd: 'angular-fullstack-deps',
        files: ['package.json', 'bower.json']
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
    jshint: {
      options: {
        curly: false,
        node: true
      },
      all: ['Gruntfile.js', '*/index.js']
    },
    env: {
      fast: {
        SKIP_E2E: true
      }
    },
    mochaTest: {
      test: {
        src: [
          'test/*.js'
        ],
        options: {
          reporter: 'spec',
          timeout: 120000
        }
      }
    },
    clean: {
      demo: {
        files: [{
          dot: true,
          src: [
            '<%= config.demo %>/*',
            '!<%= config.demo %>/readme.md',
            '!<%= config.demo %>/node_modules',
            '!<%= config.demo %>/.git',
            '!<%= config.demo %>/dist'
          ]
        }]
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
    var files = grunt.config('stage.options').files, done = this.async();
    grunt.util.spawn({
      cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
      args: ['add'].concat(files)
    }, done);
  });

  grunt.registerTask('commitNgFullstackDeps', function() {
    grunt.config.requires(
      'commitNgFullstackDeps.options.files',
      'commitNgFullstackDeps.options.cwd'
    );
    var ops = grunt.config.get('commitNgFullstackDeps').options;
    var version = require('./package.json').version || 'NO VERSION SET';
    if (Array.isArray(ops.files) && ops.files.length > 0) {
      var done = this.async();
      var cwd = path.resolve(__dirname, ops.cwd);
      grunt.util.spawn({
        cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
        args: ['commit', '-m', version].concat(ops.files),
        opts: {
          cwd: cwd
        }
      }, done);
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
        socketio: true
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

  grunt.registerTask('updateFixtures', 'updates package and bower fixtures', function(target) {
    var genVer = require('./package.json').version;
    var dest = __dirname + ((target === 'deps') ? '/angular-fullstack-deps/' : '/test/fixtures/');
    var appName = (target === 'deps') ? 'angular-fullstack-deps' : 'tempApp';

    var processJson = function(s, d) {
      // read file, strip all ejs conditionals, and parse as json
      var json = JSON.parse(fs.readFileSync(path.resolve(s), 'utf8').replace(/<%(.*)%>/g, ''));
      // set properties
      json.name = appName, json.version = genVer;
      if (target === 'deps') { json.private = false; }
      // stringify json and write it to the destination
      fs.writeFileSync(path.resolve(d), JSON.stringify(json, null, 2));
    };

    processJson('app/templates/_package.json', dest + 'package.json');
    processJson('app/templates/_bower.json', dest + 'bower.json');
  });

  grunt.registerTask('installFixtures', 'install package and bower fixtures', function() {
    var done = this.async();

    shell.cd('test/fixtures');
    grunt.log.ok('installing npm dependencies for generated app');
    child_process.exec('npm install --quiet', {cwd: '../fixtures'}, function (error, stdout, stderr) {

      grunt.log.ok('installing bower dependencies for generated app');
      child_process.exec('bower install', {cwd: '../fixtures'}, function (error, stdout, stderr) {

        if(!process.env.SAUCE_USERNAME) {
          grunt.log.ok('running npm run update-webdriver');
          child_process.exec('npm run update-webdriver', function() {
            shell.cd('../../');
            done();
          });
        } else {
          shell.cd('../../');
          done();
        }
      })
    });
  });

  grunt.registerTask('test', function(target, option) {
    if (target === 'fast') {
      grunt.task.run([
        'env:fast'
      ]);
    }

    return grunt.task.run([
      'updateFixtures',
      'installFixtures',
      'mochaTest'
    ])
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
