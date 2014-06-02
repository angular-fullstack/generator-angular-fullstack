var gulp = require('gulp'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename"),
  ngmin = require('gulp-ngmin');

gulp.task('scripts', function() {
  return gulp.src('socket.js')
    .pipe(rename('socket.min.js'))
    .pipe(ngmin())
    .pipe(uglify({
      preserveComments: 'some',
      outSourceMap: true
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['scripts']);
