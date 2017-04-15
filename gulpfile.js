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
const ghPages = require('gulp-gh-pages');
const conventionalChangelog = require('gulp-conventional-changelog');

var watching = false;

const mocha = lazypipe()
    .pipe(gulpMocha, {
        reporter: 'spec',
        timeout: 120000,
        slow: 500,
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
    return del(['generators/**/*', './test/(**|!fixtures/node_modules)/*']);
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

            if(/package.json/g.test(src) && opt.test) {
                delete json.scripts.postinstall;
                json.scripts['update-webdriver'] = 'node node_modules/gulp-protractor-runner/node_modules/protractor/bin/webdriver-manager update || node node_modules/protractor/bin/webdriver-manager update';
            }

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
    const test = target === 'test';
    const genVer = require('./package.json').version;
    const dest = __dirname + (deps ? '/angular-fullstack-deps/' : '/test/fixtures/');
    const appName = deps ? 'angular-fullstack-deps' : 'tempApp';

    return processJson('templates/app/_package.json', dest + 'package.json', {appName, genVer, private: !deps, test: test});
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
    gutil.log('installing npm dependencies for generated app');
    let progress = setInterval(() => {
        process.stdout.write('.');
    }, 1 * 1000);
    shell.cd('test/fixtures');

    let installCommand;
    if(process.platform === 'win32') {
        installCommand = 'yarn --version >nul 2>&1 && ( yarn install ) || ( npm install --quiet )';
    } else {
        installCommand = 'type yarn &> /dev/null | yarn install || npm install --quiet';
    }

    execAsync(installCommand, {
        cwd: '../fixtures'
    }).then(() => {
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

gulp.task('updateSubmodules', () => console.log('TODO'));
gulp.task('changelog', () => console.log('TODO'));
gulp.task('generateDemo', () => console.log('TODO'));
gulp.task('demo', () => console.log('TODO')); // ['clean:demo', 'generateDemo']
gulp.task('releaseDemo', () => console.log('TODO')); //['demo', 'releaseDemoBuild', 'buildcontrol:release']
gulp.task('releaseDemoBuild', () => console.log('TODO'));
gulp.task('deps', () => console.log('TODO')); // updateFixtures, david
gulp.task('release', () => console.log('TODO'));
gulp.task('lint', () => console.log('TODO')); // ['gulpfile.js', 'src/**/*.js']

gulp.task('daux', () => {
    return execAsync('daux');
});
gulp.task('copy_docs_images', () => {
  return gulp.src('./media/svg/*')
    .pipe(gulp.dest('./static/'));
});
gulp.task('gh-pages', () => {
  return gulp.src('./static/**/*')
    .pipe(ghPages());
});
gulp.task('docs', cb => {
    return runSequence('daux', 'copy_docs_images', 'gh-pages', cb);
});

let finalizeContext = function(context, writerOpts, commits, keyCommit) {
    var gitSemverTags = context.gitSemverTags;
    var commitGroups = context.commitGroups;

    if((!context.currentTag || !context.previousTag) && keyCommit) {
        var match = /tag:\s*(.+?)[,\)]/gi.exec(keyCommit.gitTags);
        var currentTag = context.currentTag = context.currentTag || match ? match[1] : null;
        var index = gitSemverTags.indexOf(currentTag);
        var previousTag = context.previousTag = gitSemverTags[index + 1];

        if(!previousTag) {
            if(options.append) {
              context.previousTag = context.previousTag || commits[0] ? commits[0].hash : null;
            } else {
              context.previousTag = context.previousTag || commits[commits.length - 1] ? commits[commits.length - 1].hash : null;
            }
        }
    } else {
        context.previousTag = context.previousTag || gitSemverTags[0];
        context.currentTag = context.currentTag || 'v' + context.version;
    }

    if(typeof context.linkCompare !== 'boolean' && context.previousTag && context.currentTag) {
        context.linkCompare = true;
    }

    if(Array.isArray(commitGroups)) {
        for(var i = 0, commitGroupsLength = commitGroups.length; i < commitGroupsLength; i++) {
            var commits = commitGroups[i].commits;
            if(Array.isArray(commits)) {
                for(var n = 1, commitsLength = commits.length; n < commitsLength; n++) {
                    var commit = commits[n], prevCommit = commits[n - 1];
                    if(commit.scope && commit.scope === prevCommit.scope) {
                        commit.subScope = true;
                        if(prevCommit.scope && !prevCommit.subScope) {
                            prevCommit.leadScope = true;
                        }
                    }
                }
            }
        }
    }
    return context;
};
let commitPartial = fs.readFileSync(path.resolve(__dirname, 'task-utils/changelog-templates/commit.hbs')).toString();

gulp.task('changelog', () => {
  return gulp.src('CHANGELOG.md', {buffer: false})
    .pipe(conventionalChangelog({
      preset: 'angular'
    }, {/*context*/}, {/*git-raw-commits*/}, {/*conventional-commits-parser*/}, {/*conventional-changelog-writer*/
        finalizeContext,
        commitPartial
    }))
    .pipe(gulp.dest('./'));
});
