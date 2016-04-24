'use strict';
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
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

var processJson = function(src, dest, opt) {
    return new Promise((resolve, reject) => {
        // read file, strip all ejs conditionals, and parse as json
        fs.readFile(path.resolve(src), 'utf8', (err, data) => {
            if(err) return reject(err);

            var json = JSON.parse(data.replace(/<%(.*)%>/g, ''));

            // set properties
            json.name = opt.appName;
            json.description = opt.private
                ? null
                : 'The purpose of this repository is to track all the possible dependencies of an application created by generator-angular-fullstack.';
            json.version = opt.genVer;
            json.private = opt.private;

            // stringify json and write it to the destination
            fs.writeFile(path.resolve(dest), JSON.stringify(json, null, 2), err => {
                if(err) reject(err);
                else resolve();
            });
        });
    });
};

function updateFixtures(target) {
    const deps = target === 'deps';
    const genVer = require('./package.json').version;
    const dest = __dirname + (deps ? '/angular-fullstack-deps/' : '/test/fixtures/');
    const appName = deps ? 'angular-fullstack-deps' : 'tempApp';

    return Promise.all([
        processJson('templates/app/_package.json', dest + 'package.json', {appName, genVer, private: !deps}),
        processJson('templates/app/_bower.json', dest + 'bower.json', {appName, genVer, private: !deps})
    ]);
}

gulp.task('updateFixtures', cb => {
    return runSequence(['updateFixtures:test', 'updateFixtures:deps'], cb);
});
gulp.task('updateFixtures:test', () => {
    return updateFixtures('test');
});
gulp.task('updateFixtures:deps', () => {
    return updateFixtures('deps');
});
