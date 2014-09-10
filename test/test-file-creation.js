/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').exec;
var helpers = require('yeoman-generator').test;
var chai = require('chai');
var expect = chai.expect;
var recursiveReadDir = require('recursive-readdir');

describe('angular-fullstack generator', function () {
  var gen, defaultOptions = {
    script: 'js',
    markup: 'html',
    stylesheet: 'sass',
    router: 'uirouter',
    mongoose: true,
    auth: true,
    oauth: [],
    socketio: true
  }, dependenciesInstalled = false;

  function generatorTest(generatorType, name, mockPrompt, callback) {
    gen.run({}, function () {
      var afGenerator;
      var deps = [path.join('../..', generatorType)];
      afGenerator = helpers.createGenerator('angular-fullstack:' + generatorType, deps, [name]);

      helpers.mockPrompt(afGenerator, mockPrompt);
      afGenerator.run([], function () {
        callback();
      });
    });
  }

  function assertOnlyFiles(expectedFiles, done, path, skip) {
    path = path || './';
    skip = skip || ['e2e', 'node_modules', 'client/bower_components'];

    recursiveReadDir(path, skip, function(err, files) {
      if (err) { return done(err); }

      for (var i = 0, expectedFilesLength = expectedFiles.length; i < expectedFilesLength; i++) {
        var index = files.indexOf(expectedFiles[i]);
        files.splice(index, 1);
      }

      if (files.length !== 0) {
        err = new Error('unexpected files found');
        err.expected = '';
        err.actual = files.join('\n');
        return done(err);
      }

      done();
    });
  }

  function runTest(type, self, cb, timeout) {
    self.timeout(timeout || 60000);
    gen.run({}, function() {
      exec(type, function(error, stdout, stderr) {
        switch(type) {
          case 'grunt test:client':
            expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Executed 1 of 1\u001b[32m SUCCESS\u001b');
            break;
          case 'grunt jshint':
            expect(stdout).to.contain('Done, without errors.');
            break;
          case 'grunt test:server':
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            break;
          default:
            expect(stderr).to.be.empty;
        }

        cb();
      });
    });
  }

  function genFiles(ops) {
    var mapping = {
      stylesheet: {
        sass: 'scss',
        stylus: 'styl',
        less: 'less',
        css: 'css'
      },
      markup: {
        jade: 'jade',
        html: 'html'
      },
      script: {
        js: 'js',
        coffee: 'coffee'
      }
    },
    files = [];

    var oauthFiles = function(type) {
      return [
        'server/auth/' + type + '/index.js',
        'server/auth/' + type + '/passport.js',
      ];
    };


    var script = mapping.script[ops.script],
        markup = mapping.markup[ops.markup],
        stylesheet = mapping.stylesheet[ops.stylesheet];

    files = files.concat([
      'client/.htaccess',
      'client/.jshintrc',
      'client/favicon.ico',
      'client/robots.txt',
      'client/index.html',
      'client/app/app.' + script,
      'client/app/app.' + stylesheet,
      'client/app/main/main.' + script,
      'client/app/main/main.' + markup,
      'client/app/main/main.' + stylesheet,
      'client/app/main/main.controller.' + script,
      'client/app/main/main.controller.spec.' + script,
      'client/assets/images/yeoman.png',
      'client/components/navbar/navbar.' + markup,
      'client/components/navbar/navbar.controller.' + script,
      'server/.jshintrc',
      'server/.jshintrc-spec',
      'server/app.js',
      'server/routes.js',
      'server/api/thing/index.js',
      'server/api/thing/index.spec.js',
      'server/api/thing/thing.controller.js',
      'server/api/thing/thing.e2e.js',
      'server/components/errors/index.js',
      'server/config/local.env.js',
      'server/config/local.env.sample.js',
      'server/config/express.js',
      'server/config/environment/index.js',
      'server/config/environment/development.js',
      'server/config/environment/production.js',
      'server/config/environment/test.js',
      'server/views/404.' + markup,
      '.bowerrc',
      '.buildignore',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      '.yo-rc.json',
      'Gruntfile.js',
      'package.json',
      'bower.json',
      'karma.conf.js',
      'mocha.conf.js',
      'protractor.conf.js'
    ]);

    if (ops.uibootstrap) {
      files = files.concat([
        'client/components/modal/modal.' + markup,
        'client/components/modal/modal.' + stylesheet,
        'client/components/modal/modal.service.' + script,
      ]);
    }

    if (ops.mongoose) {
      files = files.concat([
        'server/api/thing/thing.model.js',
        'server/config/seed.js'
      ]);
    }

    if (ops.auth) {
      files = files.concat([
        'client/app/account/account.' + script,
        'client/app/account/login/login.' + markup,
        'client/app/account/login/login.' + stylesheet,
        'client/app/account/login/login.controller.' + script,
        'client/app/account/settings/settings.' + markup,
        'client/app/account/settings/settings.controller.' + script,
        'client/app/account/signup/signup.' + markup,
        'client/app/account/signup/signup.controller.' + script,
        'client/app/admin/admin.' + markup,
        'client/app/admin/admin.' + stylesheet,
        'client/app/admin/admin.' + script,
        'client/app/admin/admin.controller.' + script,
        'client/components/auth/auth.service.' + script,
        'client/components/auth/user.service.' + script,
        'client/components/mongoose-error/mongoose-error.directive.' + script,
        'server/api/user/index.js',
        'server/api/user/index.spec.js',
        'server/api/user/user.controller.js',
        'server/api/user/user.e2e.js',
        'server/api/user/user.model.js',
        'server/api/user/user.model.spec.js',
        'server/auth/index.js',
        'server/auth/auth.service.js',
        'server/auth/local/index.js',
        'server/auth/local/passport.js'
      ]);
    }

    if (ops.oauth) {
      var oauth = ops.oauth;
      for (var i = 0, oauthLength = oauth.length; i < oauthLength; i++) {
        files = files.concat(oauthFiles(oauth[i].replace('Auth', '')));
      }
    }

    if (ops.socketio) {
      files = files.concat([
        'client/components/socket/socket.service.' + script,
        'client/components/socket/socket.mock.' + script,
        'server/api/thing/thing.socket.js',
        'server/config/socketio.js'
      ]);
    }

    return files;
  }

  function everyFile(files, ops) {
    ops = ops || {
      skip: ['node_modules', 'client/bower_components', 'e2e']
    }
  }

  beforeEach(function (done) {
    this.timeout(10000);
    var deps = [
      '../../app',
      [
        helpers.createDummyGenerator(),
        'ng-component:app'
      ]
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

  describe('running app', function() {

    beforeEach(function() {
      this.timeout(20000);
      fs.mkdirSync(__dirname + '/temp/client');
      fs.symlinkSync(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
      fs.symlinkSync(__dirname +'/fixtures/bower_components', __dirname +'/temp/client/bower_components');
    });

    describe('with default options', function() {
      beforeEach(function() {
        helpers.mockPrompt(gen, defaultOptions);
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jshint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should run server tests successfully with generated endpoint', function(done) {
        this.timeout(60000);
        generatorTest('endpoint', 'foo', {}, function() {
          exec('grunt test:server', function (error, stdout, stderr) {
            expect(stdout, 'Server tests failed (do you have mongoDB running?) \n' + stdout).to.contain('Done, without errors.');
            done();
          });
        });
      });

      it('should use existing config if available', function(done) {
        this.timeout(60000);
        fs.copySync(__dirname + '/fixtures/.yo-rc.json', __dirname + '/temp/.yo-rc.json');
        var gen = helpers.createGenerator('angular-fullstack:app', [
          '../../app',
          [
            helpers.createDummyGenerator(),
            'ng-component:app'
          ]
        ]);
        gen.options['skip-install'] = true;
        helpers.mockPrompt(gen, {
          skipConfig: true
        });
        gen.run({}, function () {
          helpers.assertFile([
            'client/app/main/main.less',
            'client/app/main/main.coffee'
          ]);
          done();
        });
      });

      it('should generate expected files', function (done) {
        gen.run({}, function () {
          helpers.assertFile(genFiles(defaultOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run({}, function () {
          assertOnlyFiles(genFiles(defaultOptions), done);
        });
      });

//      it('should run e2e tests successfully', function(done) {
//        this.timeout(80000);
//        gen.run({}, function () {
//          exec('npm run update-webdriver', function (error, stdout, stderr) {
//            exec('grunt test:e2e', function (error, stdout, stderr) {
//              expect(stdout, 'Client tests failed \n' + stdout ).to.contain('Done, without errors.');
//              done();
//            });
//          });
//        })
//      });
    });

    describe('with other preprocessors and oauth', function() {
      var testOptions = {
        script: 'coffee',
        markup: 'jade',
        stylesheet: 'less',
        router: 'uirouter',
        mongoose: true,
        auth: true,
        oauth: ['twitterAuth', 'facebookAuth', 'googleAuth'],
        socketio: true
      };

      beforeEach(function() {
        helpers.mockPrompt(gen, testOptions);
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jshint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should generate expected files', function (done) {
        gen.run({}, function () {
          helpers.assertFile(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run({}, function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });
    });

    describe('with other preprocessors and no server options', function() {
      var testOptions = {
        script: 'coffee',
        markup: 'jade',
        stylesheet: 'stylus',
        router: 'ngroute',
        mongoose: false,
        auth: false,
        oauth: [],
        socketio: false
      };

      beforeEach(function(done) {
        helpers.mockPrompt(gen, testOptions);
        done();
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jshint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should generate expected files', function (done) {
        gen.run({}, function () {
          helpers.assertFile(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run({}, function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });
    });

    describe('with no preprocessors and no server options', function() {
      var testOptions = {
        script: 'js',
        markup: 'html',
        stylesheet: 'css',
        router: 'ngroute',
        mongoose: false,
        auth: false,
        oauth: [],
        socketio: false
      };

      beforeEach(function(done) {
        helpers.mockPrompt(gen, testOptions);
        done();
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jshint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should generate expected files', function (done) {
        gen.run({}, function () {
          helpers.assertFile(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run({}, function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });
    });
  });
});
