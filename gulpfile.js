'use strict';
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const _ = require('lodash');
const Promise = require('bluebird');
const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const gulpMocha = require('gulp-mocha');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const del = require('del');
const lazypipe = require('lazypipe');
const runSequence = require('run-sequence');
const merge = require('merge-stream');
const shell = require('shelljs');

var watching = false;

const mocha = lazypipe()
    .pipe(gulpMocha, {
        reporter: 'spec',
        timeout: 120000,
        globals: {
            should: require('should')
        },
        require: [
            './mocha.conf'
        ]
    });

const transpile = lazypipe()
    .pipe(babel);

gulp.task('clean', () => {
    return del(['generators/**/*']);
});

gulp.task('babel', () => {
    let generators = gulp.src(['src/generators/**/*.js'])
    .pipe(gulpIf(watching, plumber()))
        .pipe(transpile())
        .pipe(gulp.dest('generators'));

    let test = gulp.src(['src/test/**/*.js'])
    .pipe(gulpIf(watching, plumber()))
        .pipe(transpile())
        .pipe(gulp.dest('test'));

    return merge(generators, test);
});

gulp.task('watch', () => {
    watching = true;
    return gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('copy', () => {
    let nonJsGen = gulp.src(['src/generators/**/*', '!src/generators/**/*.js'], {dot: true})
        .pipe(gulp.dest('generators'));

    let nonJsTest = gulp.src(['src/test/**/*', '!src/test/**/*.js'], {dot: true})
        .pipe(gulp.dest('test'));

    return merge(nonJsGen, nonJsTest);
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

function execAsync(cmd, opt) {
    return new Promise((resolve, reject) => {
        exec(cmd, opt, (err, stdout, stderr) => {
            if(err) {
                console.log(`stderr: ${stderr}`);
                return reject(err);
            }

            return resolve(stdout);
        })
    });
}

gulp.task('installFixtures', function() {
    gutil.log('installing npm & bower dependencies for generated app');
    let progress = setInterval(() => {
        process.stdout.write('.');
    }, 1 * 1000);
    shell.cd('test/fixtures');

    return Promise.all([
        execAsync('npm install --quiet', {cwd: '../fixtures'}),
        execAsync('bower install', {cwd: '../fixtures'})
    ]).then(() => {
        process.stdout.write('\n');
        if(!process.env.SAUCE_USERNAME) {
            gutil.log('running npm run-script update-webdriver');
            return execAsync('npm run-script update-webdriver').then(() => {
                clearInterval(progress);
                process.stdout.write('\n');
                shell.cd('../../');
            });
        } else {
            clearInterval(progress);
            process.stdout.write('\n');
            shell.cd('../../');
            return Promise.resolve();
        }
    });
});

gulp.task('test', () => {
    return gulp.src(['test/pre.test.js', 'test/*.test.js'])
        .pipe(mocha());
});
