'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');

var handleErr = function (err) {
  console.log(err.message);
  process.exit(1);
};

gulp.task('static', function () {
  return gulp.src([
    'test/*.js',
    'lib/**/*.js',
    'benchmark/**/*.js',
    'index.js',
    'doc.js',
    'gulpfile.js'
  ])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
  .pipe(jscs())
  .on('error', handleErr)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('test', function (cb) {
  gulp.src([
    'lib/**/*.js',
    'index.js'
  ])
  .pipe(istanbul())
  .on('finish', function () {
    gulp.src(['test/*.js'])
      .pipe(mocha({
        reporter: 'spec',
        timeout: 100000
      }))
      .pipe(istanbul.writeReports())
      .on('end', cb);
  });
});

gulp.task('coveralls', ['test'], function () {
  return gulp.src('coverage/lcov.info').pipe(coveralls());
});

gulp.task('default', ['static', 'test', 'coveralls']);
