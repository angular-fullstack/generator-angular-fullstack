/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');
var chai = require('chai');
var expect = chai.expect;
var recursiveReadDir = require('recursive-readdir');

describe('angular-fullstack generator', function () {
  var gen, defaultOptions = {
    script: 'js',
    babel: true,
    markup: 'html',
    stylesheet: 'sass',
    router: 'uirouter',
    testing: 'mocha',
    chai: 'expect',
    bootstrap: true,
    uibootstrap: true,
    odms: [ 'mongoose' ],
    auth: true,
    oauth: [],
    socketio: true
  }, dependenciesInstalled = false;

  function copySync(s, d) { fs.writeFileSync(d, fs.readFileSync(s)); }

  function generatorTest(generatorType, name, mockPrompt, callback) {
    gen.run(function () {
      var afGenerator;
      var deps = [path.join('../..', generatorType)];
      afGenerator = helpers.createGenerator('angular-fullstack:' + generatorType, deps, [name], {
        skipInstall: true
      });

      helpers.mockPrompt(afGenerator, mockPrompt);
      afGenerator.run(function () {
        callback();
      });
    });
  }

  /**
   * Assert that only an array of files exist at a given path
   *
   * @param  {Array}    expectedFiles - array of files
   * @param  {Function} done          - callback(error{Error})
   * @param  {String}   topLevelPath  - top level path to assert files at (optional)
   * @param  {Array}    skip          - array of paths to skip/ignore (optional)
   *
   */
  function assertOnlyFiles(expectedFiles, done, topLevelPath, skip) {
    topLevelPath = topLevelPath || './';
    skip = skip || ['node_modules', 'client/bower_components'];

    recursiveReadDir(topLevelPath, skip, function(err, actualFiles) {
      if (err) { return done(err); }
      var files = actualFiles.concat();

      expectedFiles.forEach(function(file, i) {
        var index = files.indexOf(path.normalize(file));
        if (index >= 0) {
          files.splice(index, 1);
        }
      });

      if (files.length !== 0) {
        err = new Error('unexpected files found');
        err.expected = expectedFiles.join('\n');
        err.actual = files.join('\n');
        return done(err);
      }

      done();
    });
  }

  /**
   * Exec a command and run test assertion(s) based on command type
   *
   * @param  {String}   cmd      - the command to exec
   * @param  {Object}   self     - context of the test
   * @param  {Function} cb       - callback()
   * @param  {String}   endpoint - endpoint to generate before exec (optional)
   * @param  {Number}   timeout  - timeout for the exec and test (optional)
   *
   */
  function runTest(cmd, self, cb) {
    var args = Array.prototype.slice.call(arguments),
        endpoint = (args[3] && typeof args[3] === 'string') ? args.splice(3, 1)[0] : null,
        timeout = (args[3] && typeof args[3] === 'number') ? args.splice(3, 1)[0] : null;

    self.timeout(timeout || 60000);

    var execFn = function() {
      var cmdCode;
      var cp = exec(cmd, function(error, stdout, stderr) {
        if(cmdCode !== 0) {
          console.error(stdout);
          throw new Error('Error running command: ' + cmd);
        }
        cb();
      });
      cp.on('exit', function (code) {
        cmdCode = code;
      });
    };

    if (endpoint) {
      generatorTest('endpoint', endpoint, {}, execFn);
    } else {
      gen.run(execFn);
    }
  }

  /**
   * Generate an array of files to expect from a set of options
   *
   * @param  {Object} ops - generator options
   * @return {Array}      - array of files
   *
   */
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
        js: 'js'
      }
    },
    files = [];

    /**
     * Generate an array of OAuth files based on type
     *
     * @param  {String} type - type of oauth
     * @return {Array}       - array of files
     *
     */
    var oauthFiles = function(type) {
      return [
        'server/auth/' + type + '/index.js',
        'server/auth/' + type + '/passport.js',
      ];
    };


    var script = mapping.script[ops.script],
        markup = mapping.markup[ops.markup],
        stylesheet = mapping.stylesheet[ops.stylesheet],
        models = ops.models ? ops.models : ops.odms[0];

    /* Core Files */
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
      'client/components/footer/footer.' + stylesheet,
      'client/components/footer/footer.' + markup,
      'client/components/footer/footer.directive.' + script,
      'client/components/navbar/navbar.' + markup,
      'client/components/navbar/navbar.controller.' + script,
      'client/components/navbar/navbar.directive.' + script,
      'server/.jshintrc',
      'server/.jshintrc-spec',
      'server/app.js',
      'server/index.js',
      'server/routes.js',
      'server/api/thing/index.js',
      'server/api/thing/index.spec.js',
      'server/api/thing/thing.controller.js',
      'server/api/thing/thing.integration.js',
      'server/components/errors/index.js',
      'server/config/local.env.js',
      'server/config/local.env.sample.js',
      'server/config/express.js',
      'server/config/environment/index.js',
      'server/config/environment/development.js',
      'server/config/environment/production.js',
      'server/config/environment/test.js',
      'server/config/environment/shared.js',
      'server/views/404.' + markup,
      'e2e/main/main.po.js',
      'e2e/main/main.spec.js',
      'e2e/components/navbar/navbar.po.js',
      '.bowerrc',
      '.buildignore',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      '.jscs.json',
      '.yo-rc.json',
      'Gruntfile.js',
      'package.json',
      'bower.json',
      'karma.conf.js',
      'mocha.conf.js',
      'protractor.conf.js',
      'README.md'
    ]);

    /* Ui-Router */
    if (ops.router === 'uirouter') {
      files = files.concat([
        'client/components/ui-router/ui-router.mock.' + script
      ]);
    }

    /* Ui-Bootstrap */
    if (ops.uibootstrap) {
      files = files.concat([
        'client/components/modal/modal.' + markup,
        'client/components/modal/modal.' + stylesheet,
        'client/components/modal/modal.service.' + script
      ]);
    }

    /* Models - Mongoose or Sequelize */
    if (models) {
      files = files.concat([
        'server/api/thing/thing.model.js',
        'server/api/thing/thing.events.js',
        'server/config/seed.js'
      ]);
    }

    /* Sequelize */
    if (ops.odms.indexOf('sequelize') !== -1) {
      files = files.concat([
        'server/sqldb/index.js'
      ]);
    }

    /* Authentication */
    if (ops.auth) {
      files = files.concat([
        'client/app/account/account.' + script,
        'client/app/account/login/login.' + markup,
        'client/app/account/login/login.controller.' + script,
        'client/app/account/settings/settings.' + markup,
        'client/app/account/settings/settings.controller.' + script,
        'client/app/account/signup/signup.' + markup,
        'client/app/account/signup/signup.controller.' + script,
        'client/app/admin/admin.' + markup,
        'client/app/admin/admin.' + stylesheet,
        'client/app/admin/admin.' + script,
        'client/app/admin/admin.controller.' + script,
        'client/components/auth/auth.module.' + script,
        'client/components/auth/auth.service.' + script,
        'client/components/auth/user.service.' + script,
        'client/components/mongoose-error/mongoose-error.directive.' + script,
        'server/api/user/index.js',
        'server/api/user/index.spec.js',
        'server/api/user/user.controller.js',
        'server/api/user/user.integration.js',
        'server/api/user/user.model.js',
        'server/api/user/user.model.spec.js',
        'server/api/user/user.events.js',
        'server/auth/index.js',
        'server/auth/auth.service.js',
        'server/auth/local/index.js',
        'server/auth/local/passport.js',
        'e2e/account/login/login.po.js',
        'e2e/account/login/login.spec.js',
        'e2e/account/logout/logout.spec.js',
        'e2e/account/signup/signup.po.js',
        'e2e/account/signup/signup.spec.js'
      ]);
    }

    if (ops.oauth && ops.oauth.length) {
      /* OAuth (see oauthFiles function above) */
      ops.oauth.forEach(function(type, i) {
        files = files.concat(oauthFiles(type.replace('Auth', '')));
      });


      files = files.concat([
        'client/components/oauth-buttons/oauth-buttons.' + stylesheet,
        'client/components/oauth-buttons/oauth-buttons.' + markup,
        'client/components/oauth-buttons/oauth-buttons.controller.' + script,
        'client/components/oauth-buttons/oauth-buttons.controller.spec.' + script,
        'client/components/oauth-buttons/oauth-buttons.directive.' + script,
        'client/components/oauth-buttons/oauth-buttons.directive.spec.' + script,
        'e2e/components/oauth-buttons/oauth-buttons.po.js'
      ]);
    }

    /* Socket.IO */
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


  /**
   * Generator tests
   */

  beforeEach(function (done) {
    this.timeout(10000);
    var deps = [
      '../../app',
      '../../endpoint',
      [
        helpers.createDummyGenerator(),
        'ng-component:app'
      ]
    ];

    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      gen = helpers.createGenerator('angular-fullstack:app', deps, [], {
        skipInstall: true
      });
      done();
    }.bind(this));
  });

  describe('making sure test fixtures are present', function() {

    it('should have package.json in fixtures', function() {
      assert.file([
        path.join(__dirname, 'fixtures', 'package.json')
      ]);
    });

    it('should have bower.json in fixtures', function() {
      assert.file([
        path.join(__dirname, 'fixtures', 'bower.json')
      ]);
    });

    it('should have all npm packages in fixtures/node_modules', function() {
      var packageJson = require('./fixtures/package.json');
      var deps = Object.keys(packageJson.dependencies);
      deps = deps.concat(Object.keys(packageJson.devDependencies));
      deps = deps.map(function(dep) {
        return path.join(__dirname, 'fixtures', 'node_modules', dep);
      });
      assert.file(deps);
    });

    it('should have all bower packages in fixtures/bower_components', function() {
      var bowerJson = require('./fixtures/bower.json');
      var deps = Object.keys(bowerJson.dependencies);
      deps = deps.concat(Object.keys(bowerJson.devDependencies));
      deps = deps.map(function(dep) {
        return path.join(__dirname, 'fixtures', 'bower_components', dep);
      });
      assert.file(deps);
    });
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

      it('should pass jscs', function(done) {
        runTest('grunt jscs', this, done);
      });

      it('should pass lint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should pass jscs with generated endpoint', function(done) {
        runTest('grunt jscs', this, done, 'foo');
      });

      it('should pass lint with generated endpoint', function(done) {
        runTest('grunt jshint', this, done, 'foo');
      });

      it('should run server tests successfully with generated endpoint', function(done) {
        runTest('grunt test:server', this, done, 'foo');
      });

      it('should pass lint with generated capitalized endpoint', function(done) {
        runTest('grunt jshint', this, done, 'Foo');
      });

      it('should run server tests successfully with generated capitalized endpoint', function(done) {
        runTest('grunt test:server', this, done, 'Foo');
      });

      it('should pass lint with generated path name endpoint', function(done) {
        runTest('grunt jshint', this, done, 'foo/bar');
      });

      it('should run server tests successfully with generated path name endpoint', function(done) {
        runTest('grunt test:server', this, done, 'foo/bar');
      });

      it('should generate expected files with path name endpoint', function(done) {
        runTest('(exit 0)', this, function() {
          assert.file([
            'server/api/foo/bar/index.js',
            'server/api/foo/bar/index.spec.js',
            'server/api/foo/bar/bar.controller.js',
            'server/api/foo/bar/bar.events.js',
            'server/api/foo/bar/bar.integration.js',
            'server/api/foo/bar/bar.model.js',
            'server/api/foo/bar/bar.socket.js'
          ]);
          done();
        }, 'foo/bar');
      });

      it('should use existing config if available', function(done) {
        this.timeout(60000);
        copySync(__dirname + '/fixtures/.yo-rc.json', __dirname + '/temp/.yo-rc.json');
        var gen = helpers.createGenerator('angular-fullstack:app', [
          '../../app',
          '../../endpoint',
          [
            helpers.createDummyGenerator(),
            'ng-component:app'
          ]
        ], [], {
          skipInstall: true
        });
        helpers.mockPrompt(gen, {
          skipConfig: true
        });
        gen.run(function () {
          assert.file([
            'client/app/main/main.less',
            'server/auth/google/passport.js'
          ]);
          done();
        });
      });

      it('should generate expected files', function (done) {
        gen.run(function () {
          assert.file(genFiles(defaultOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run(function () {
          assertOnlyFiles(genFiles(defaultOptions), done);
        });
      });

      if(!process.env.SKIP_E2E) {
        it('should run e2e tests successfully', function(done) {
          runTest('grunt test:e2e', this, done, 240000);
        });

        //it('should run e2e tests successfully for production app', function(done) {
        //  runTest('grunt test:e2e:prod', this, done, 240000);
        //});
      }
    });

    describe('with other preprocessors and oauth', function() {
      var testOptions = {
        script: 'js',
        babel: true,
        markup: 'jade',
        stylesheet: 'less',
        router: 'uirouter',
        testing: 'jasmine',
        odms: [ 'mongoose' ],
        auth: true,
        oauth: ['twitterAuth', 'facebookAuth', 'googleAuth'],
        socketio: true,
        bootstrap: true,
        uibootstrap: true
      };

      beforeEach(function() {
        helpers.mockPrompt(gen, testOptions);
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jscs', function(done) {
        runTest('grunt jscs', this, done);
      });

      it('should pass lint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should pass jscs with generated endpoint', function(done) {
        runTest('grunt jscs', this, done, 'foo');
      });

      it('should pass lint with generated snake-case endpoint', function(done) {
        runTest('grunt jshint', this, done, 'foo-bar');
      });

      it('should run server tests successfully with generated snake-case endpoint', function(done) {
        runTest('grunt test:server', this, done, 'foo-bar');
      });

      it('should generate expected files', function (done) {
        gen.run(function () {
          assert.file(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run(function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });

      if(!process.env.SKIP_E2E) {
        it('should run e2e tests successfully', function (done) {
          runTest('grunt test:e2e', this, done, 240000);
        });

        //it('should run e2e tests successfully for production app', function (done) {
        //  runTest('grunt test:e2e:prod', this, done, 240000);
        //});
      }

    });

    describe('with sequelize models, auth', function() {
      var testOptions = {
        script: 'js',
        markup: 'jade',
        stylesheet: 'stylus',
        router: 'uirouter',
        testing: 'jasmine',
        odms: [ 'sequelize' ],
        auth: true,
        oauth: ['twitterAuth', 'facebookAuth', 'googleAuth'],
        socketio: true,
        bootstrap: true,
        uibootstrap: true
      };

      beforeEach(function() {
        helpers.mockPrompt(gen, testOptions);
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jscs', function(done) {
        runTest('grunt jscs', this, done);
      });

      it('should pass lint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should pass jscs with generated endpoint', function(done) {
        runTest('grunt jscs', this, done, 'foo');
      });

      it('should pass lint with generated snake-case endpoint', function(done) {
        runTest('grunt jshint', this, done, 'foo-bar');
      });

      it('should run server tests successfully with generated snake-case endpoint', function(done) {
        runTest('grunt test:server', this, done, 'foo-bar');
      });

      it('should generate expected files', function (done) {
        gen.run(function () {
          assert.file(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run(function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });

      if(!process.env.SKIP_E2E) {
        it('should run e2e tests successfully', function (done) {
          runTest('grunt test:e2e', this, done, 240000);
        });

        //it('should run e2e tests successfully for production app', function (done) {
        //  runTest('grunt test:e2e:prod', this, done, 240000);
        //});
      }

    });

    describe('with other preprocessors and no server options', function() {
      var testOptions = {
        script: 'js',
        babel: true,
        markup: 'jade',
        stylesheet: 'stylus',
        router: 'ngroute',
        testing: 'mocha',
        chai: 'should',
        odms: [],
        auth: false,
        oauth: [],
        socketio: false,
        bootstrap: false,
        uibootstrap: false
      };

      beforeEach(function(done) {
        helpers.mockPrompt(gen, testOptions);
        done();
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jscs', function(done) {
        runTest('grunt jscs', this, done);
      });

      it('should pass lint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should pass jscs with generated endpoint', function(done) {
        runTest('grunt jscs', this, done, 'foo');
      });

      it('should pass lint with generated endpoint', function(done) {
        runTest('grunt jshint', this, done, 'foo');
      });

      it('should run server tests successfully with generated endpoint', function(done) {
        runTest('grunt test:server', this, done, 'foo');
      });

      it('should generate expected files', function (done) {
        gen.run(function () {
          assert.file(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run(function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });

      if(!process.env.SKIP_E2E) {
        it('should run e2e tests successfully', function (done) {
          runTest('grunt test:e2e', this, done, 240000);
        });

        //it('should run e2e tests successfully for production app', function (done) {
        //  runTest('grunt test:e2e:prod', this, done, 240000);
        //});
      }

    });

    describe('with no preprocessors and no server options', function() {
      var testOptions = {
        script: 'js',
        markup: 'html',
        stylesheet: 'css',
        router: 'ngroute',
        testing: 'jasmine',
        odms: [],
        auth: false,
        oauth: [],
        socketio: false,
        bootstrap: true,
        uibootstrap: true
      };

      beforeEach(function(done) {
        helpers.mockPrompt(gen, testOptions);
        done();
      });

      it('should run client tests successfully', function(done) {
        runTest('grunt test:client', this, done);
      });

      it('should pass jscs', function(done) {
        runTest('grunt jscs', this, done);
      });

      it('should pass lint', function(done) {
        runTest('grunt jshint', this, done);
      });

      it('should run server tests successfully', function(done) {
        runTest('grunt test:server', this, done);
      });

      it('should generate expected files', function (done) {
        gen.run(function () {
          assert.file(genFiles(testOptions));
          done();
        });
      });

      it('should not generate unexpected files', function (done) {
        gen.run(function () {
          assertOnlyFiles(genFiles(testOptions), done);
        });
      });

      if(!process.env.SKIP_E2E) {
        it('should run e2e tests successfully', function (done) {
          runTest('grunt test:e2e', this, done, 240000);
        });

        //it('should run e2e tests successfully for production app', function (done) {
        //  runTest('grunt test:e2e:prod', this, done, 240000);
        //});
      }

    });
  });
});
