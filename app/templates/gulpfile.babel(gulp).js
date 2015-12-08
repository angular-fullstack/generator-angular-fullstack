// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= rootGeneratorName() %> <%= rootGeneratorVersion() %>
'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import {stream as wiredep} from 'wiredep';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';<% if(filters.stylus) { %>
import nib from 'nib';<% } %>

var plugins = gulpLoadPlugins();
var config;

const paths = {
    appPath: require('./bower.json').appPath || 'client',
    client: {
        assets: 'client/assets/**/*',
        images: 'client/assets/images/*',
        scripts: [
            'client/**/*.<%= scriptExt %>',
            '!client/bower_components/**/*.js'
        ],
        styles: ['client/{app,components}/**/*.<%= styleExt %>'],
        mainStyle: 'client/app/app.<%= styleExt %>',
        views: 'client/{app,components}/**/*.<%= templateExt %>',
        mainView: 'client/index.html',
        test: ['client/**/*.spec.<%= scriptExt %>'],
        testRequire: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/**/*.spec.<%= scriptExt %>'
        ],
        bower: 'client/bower_components/'
    },
    server: {
        scripts: ['server/**/*.<%= scriptExt %>'],
        json: ['server/**/*.json'],
        test: [
            'server/**/*.spec.js',
            'server/**/*.mock.js',
            'server/**/*.integration.js'
        ]
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
    var options = {
        host: 'localhost',
        port: config.port
    };
    http
        .get(options, () => cb(true))
        .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
    var serverReady = false;
    var appReadyInterval = setInterval(() =>
        checkAppReady((ready) => {
            if (!ready || serverReady) {
                return;
            }
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        }),
        100);
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, 'client/.jshintrc')
    .pipe(plugins.jshint.reporter, 'jshint-stylish');<% } %>

let lintServerScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, 'server/.jshintrc')
    .pipe(plugins.jshint.reporter, 'jshint-stylish');<% } %>

let styles = lazypipe()
    .pipe(plugins.sourcemaps.init)<% if(filters.stylus) { %>
    .pipe(plugins.stylus, {
        use: [nib()],
        errors: true
    })<% } if(filters.sass) { %>
    .pipe(plugins.sass)<% } if(filters.less) { %>
    .pipe(plugins.less)<% } %>
    .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
    .pipe(plugins.sourcemaps.write, '.');<% if(filters.babel || filters.coffee) { %>

let transpile = lazypipe()
    .pipe(plugins.sourcemaps.init)<% if(filters.babel) { %>
    .pipe(plugins.babel, {
        optional: ['es7.classProperties']
    })<% } else { %>
    .pipe(plugins.coffee, {bare: true})<% } %>
    .pipe(plugins.sourcemaps.write, '.');<% } %>

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require('./server/config/local.env');
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});
gulp.task('env:test', () => {
    plugins.env({
        vars: {NODE_ENV: 'test'}
    });
});
gulp.task('env:prod', () => {
    plugins.env({
        vars: {NODE_ENV: 'production'}
    });
});

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
    runSequence(['inject:js', 'inject:css', 'inject:<%= styleExt %>'], cb);
});

gulp.task('inject:js', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.scripts, ['!client/**/*.spec.<%= scriptExt %>']), {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '<!-- injector:js -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<script src="' + filepath.replace('/client/', '') + '"></script>'
            }))
        .pipe(gulp.dest('client'));
});

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src('/client/**/*.css', {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '<!-- injector:css -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace('/client/', '').replace('/.tmp/', '') + '">'
            }))
        .pipe(gulp.dest('client'));
});

gulp.task('inject:<%= styleExt %>', () => {
    return gulp.src('client/app/app.<%= styleExt %>')
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '// injector',
                endtag: '// endinjector',
                transform: (filepath) => {
                    let newPath = filepath
                        .replace('/client/app/', '')
                        .replace('/client/components/', '../components/')
                        .replace(/_(.*).<%= styleExt %>/, (match, p1, offset, string) => p1)
                        .replace('.<%= styleExt %>', '');
                    return '@import \'' + newPath + '\';';
                }
            }))
        .pipe(gulp.dest('client/app'));
});

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});<% if(filters.babel || filters.coffee) { %>

gulp.task('transpile:client', () => {
    return gulp.src(paths.client.scripts)
        .pipe(transpile())
        .pipe(gulp.dest('.tmp'));
});<% } %>

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpile())
        .pipe(gulp.dest(paths.dist + '/server'));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    return gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, blob => '!' + blob)))
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
    return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*']));

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require('./server/config/environment');
    nodemon('-w server server')
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test);

    plugins.livereload.listen();

    plugins.watch(paths.client.styles, () => {  //['inject:<%= styleExt %>']
        gulp.src(paths.client.mainStyle)
            .pipe(plugins.plumber())
            .pipe(styles())
            .pipe(gulp.dest('.tmp/app'))
            .pipe(plugins.livereload());
    });

    plugins.watch(paths.client.views)
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts) //['inject:js']
        .pipe(plugins.plumber())<% if(filters.babel || filters.coffee) { %>
        .pipe(transpile())
        .pipe(gulp.dest('.tmp'))<% } %>
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts())
        .pipe(plugins.livereload());

    gulp.watch('bower.json', ['wiredep:client']);
});

gulp.task('serve', cb => {
    runSequence(['clean:tmp', 'constant'],
        ['lint:scripts', 'inject'<% if(filters.jade) { %>, 'jade'<% } %>],
        ['wiredep:client'],<% if(filters.babel || filters.coffee) { %>
        ['transpile:client', 'styles'],<% } else { %>
        'styles',<% } %>
        ['start:server', 'start:client'],
        'watch',
        cb);
});

gulp.task('test', cb => {
    return runSequence('test:server', 'test:client', cb);
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        //'mocha:coverage',
        cb);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test)
        .pipe(plugins.mocha({
            reporter: 'spec',
            require: [
                './mocha.conf'
            ]
        }))
        .once('end', function() {
            process.exit();
        });
});

gulp.task('test:client', () => {
    let testFiles = _.union(paths.client.testRequire, paths.client.test);
    return gulp.src(testFiles)
        .pipe(plugins.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

// inject bower components
gulp.task('wiredep:client', () => {
    return gulp.src(paths.client.mainView)
        .pipe(wiredep({
            exclude: [
                /bootstrap-sass-official/,
                /bootstrap.js/,
                /json3/,
                /es5-shim/,
                /bootstrap.css/,
                /font-awesome.css/
            ],
            ignorePath: paths.appPath
        }))
        .pipe(gulp.dest('client/'));
});

gulp.task('wiredep:test', () => {
    gulp.src(paths.karma)
        .pipe(wiredep({
            exclude: [
                /bootstrap-sass-official/,
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /bootstrap.css/,
                /font-awesome.css/
            ],
            devDependencies: true
        }))
        .pipe(gulp.dest('./'));
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
    runSequence(
        'clean:dist',
        'inject',
        'wiredep:client',
        [
            'build:images',
            'copy:extras',
            'copy:assets',
            'copy:server',
            'transpile:server',
            'build:client'
        ],
        cb);
});

gulp.task('clean:dist', () => del(['dist/**/*']));

gulp.task('build:client', ['transpile:client', 'styles', 'html'], () => {
    var appFilter = plugins.filter('**/app.js');
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');
    var htmlFilter = plugins.filter('**/*.html');<% if(filters.jade) { %>
    var assetsFilter = plugins.filter('**/*.{js,css}');<% } %>

    let assets = plugins.useref.assets({searchPath: ['client', '.tmp']});

    return gulp.src(paths.mainView)<% if(filters.jade) { %>
        .pipe(plugins.jade({pretty: true}))<% } %>
        .pipe(assets)
            .pipe(appFilter)
                .pipe(plugins.addSrc.append('.tmp/templates.js'))
                .pipe(plugins.concat('app/app.js'))
            .pipe(appFilter.restore())
            .pipe(jsFilter)
                .pipe(plugins.ngAnnotate())
                .pipe(plugins.uglify())
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
                .pipe(plugins.minifyCss({
                    cache: true,
                    processImportFrom: ['!fonts.googleapis.com']
                }))
            .pipe(cssFilter.restore())
            .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(plugins.revReplace())
        .pipe(plugins.useref())<% if(filters.jade) { %>
        .pipe(assetsFilter)<% } %>
        .pipe(gulp.dest(paths.dist + '/client'));
});

gulp.task('html', function() {
    return gulp.src('client/{app,components}/**/*.html')
        .pipe(plugins.angularTemplatecache({
            module: '<%= scriptAppName %>'
        }))
        .pipe(gulp.dest('.tmp'));
});<% if (filters.jade) { %>
gulp.task('jade', function() {
  gulp.src(paths.client.views)
    .pipe(plugins.jade())
    .pipe(gulp.dest('.tmp'));
});<% } %>

gulp.task('constant', function() {
  let sharedConfig = require('./server/config/environment/shared');
  plugins.ngConstant({
    name: '<%= scriptAppName %>.constants',
    deps: [],
    wrap: true,
    stream: true,
    constants: { appConfig: sharedConfig }
  })
    .pipe(plugins.rename({
      basename: 'app.constant'
    }))
    .pipe(gulp.dest('client/app/'))
})

gulp.task('build:images', () => {
    return gulp.src('client/assets/images/**/*')
        .pipe(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.dist + '/client/assets/images'));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        'client/favicon.ico',
        'client/robots.txt'
    ], { dot: true })
        .pipe(gulp.dest(paths.dist + '/client'));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(paths.dist + '/client/assets'));
});

gulp.task('copy:server', () => {
    return gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
