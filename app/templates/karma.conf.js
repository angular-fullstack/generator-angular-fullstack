// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)<% if (filters.jasmine) { %>
    frameworks: ['jasmine'],<% } if (filters.mocha) { %>
    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

    client: {
      mocha: {
        timeout: 5000 // set default mocha spec timeout
      }
    },<% } %>

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      // endbower<% if (filters.socketio) { %>
      'node_modules/socket.io-client/socket.io.js',<% } %>
      'client/app/app.js',
      'client/{app,components}/**/*.module.js',
      'client/{app,components}/**/*.js',
      'client/{app,components}/**/*.<%= filters.jade ? '{jade,html}' : 'html' %>'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js'<% if (filters.jade) { %>,
      '**/*.jade': 'ng-jade2js'<% } if (filters.babel) { %>,
      'client/{app,components}/**/*.js': 'babel'<% } %>
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },<% if (filters.jade) { %>

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },<% } if (filters.babel) { %>

    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
        optional: [
          'es7.classProperties'
        ]
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },<% } %>

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
