// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/dist/lodash.compat.js',<% if(filters.socketio) { %>
      'client/bower_components/angular-socket-io/socket.js',<% } %><% if(filters.uirouter) { %>
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',<% } %>
      '{.tmp,client}/app/app.js',
      '{.tmp,client}/app/**/*.js',
      '{.tmp,client}/components/**/*.js',
      '{.tmp,client}/app/**/*.html',
      '{.tmp,client}/components/**/*.html'
    ],

    preprocessors: {
      '{.tmp,client}/app/**/*.html': 'html2js',
      '{.tmp,client}/components/**/*.html': 'html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: '(.tmp|client)/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
