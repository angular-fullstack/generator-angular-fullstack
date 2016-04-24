'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean', () => {
    return del(['generators/**/*']);
});

gulp.task('babel', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('generators'));
});

gulp.task('watch', () => {
    return gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('copy', () => {
    return gulp.src(['src/**/*', '!src/**/*.js'])
        .pipe(gulp.dest('generators'));
});

gulp.task('build', cb => {
    return runSequence(
        'clean',
        'babel',
        'copy',
        cb
    );
});
