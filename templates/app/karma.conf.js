// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html
/*eslint-env node*/

import makeWebpackConfig from './webpack.make';

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
    files: ['spec.js'],

    preprocessors: {
      'spec.js': ['webpack']
    },

    webpack: makeWebpackConfig({ TEST: true }),

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },

    coverageReporter: {
      reporters: [{
        type: 'html', //produces a html document after code is run
        subdir: 'client'
      }, {
        type: 'json',
        subdir: '.',
        file: 'client-coverage.json'
      }],
      dir: 'coverage/' //path to created html doc
    },

    plugins: [
      require('karma-chai-plugins'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-firefox-launcher'),
      <%_ if(filters.mocha) { _%>
      require('karma-mocha'),
      require('karma-chai-plugins'),<% } %>
      <%_ if(filters.jasmine) { _%>
      require('karma-jasmine'),<% } %>
      require('karma-spec-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-script-launcher'),
      require('karma-webpack')
    ],

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
    reporters: ['spec', 'coverage'],

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
