// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

import _ from 'lodash';
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

var yeoman = {
    app: require('./bower.json').appPath || 'client/app'
};

var paths = {
    client: {
        scripts: [
            'client/**/*.<%= scriptExt %>',
            '!client/bower_components/**/*.js'
        ],
        styles: ['client/{app,components}/**/*.<%= styleExt %>'],
        mainStyle: 'client/app/app.<%= styleExt %>',
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
        test: [
            'server/**/*.spec.js',
            'server/**/*.mock.js',
            'server/**/*.integration.js'
        ]
    },
    views: {
        main: 'client/index.<%= templateExt %>',
        files: ['client/app/**/*.<%= templateExt %>']
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
        port: config.port,
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
            if(!ready || serverReady) {
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
    .pipe(gulp.src, paths.client.mainStyle)
    .pipe(plugins.sourcemaps.init)<% if(filters.stylus) { %>
    .pipe(plugins.stylus, {
        use: [nib()],
        errors: true
    })<% } if(filters.sass) { %>
    .pipe(plugins.sass)<% } if(filters.less) { %>
    .pipe(plugins.less)<% } %>
    .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
    .pipe(plugins.sourcemaps.write, '.')
    .pipe(gulp.dest, '.tmp/app');<% if(filters.babel || filters.coffee) { %>

let transpile = lazypipe()
    .pipe(plugins.sourcemaps.init)<% if(filters.babel) { %>
    .pipe(plugins.babel)<% } else { %>
    .pipe(plugins.coffee, {bare: true})<% } %>
    .pipe(plugins.sourcemaps.write, '.');<% } %>

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
    runSequence(['inject:js', 'inject:css', 'inject:<%= styleExt %>'], cb);
});

gulp.task('inject:js', () => {
    return gulp.src(paths.views.main)
        .pipe(plugins.inject(gulp.src(_.union(
            paths.client.scripts,
            ['!client/**/*.spec.<%= scriptExt %>']
        ), {read: false}), {
            starttag: '<!-- injector:js -->',
            endtag: '<!-- endinjector -->',
            transform: (filepath) => '<script src="' + filepath.replace('/client/', '') + '"></script>'
        }))
        .pipe(gulp.dest('client'));
});

gulp.task('inject:css', () => {
    return gulp.src(paths.views.main)
        .pipe(plugins.inject(gulp.src('/client/**/*.css', {read: false}), {
            starttag: '<!-- injector:css -->',
            endtag: '<!-- endinjector -->',
            transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace('/client/', '').replace('/.tmp/', '') + '">'
        }))
        .pipe(gulp.dest('client'));
});

// TODO: other styles
gulp.task('inject:<%= styleExt %>', () => {
    return gulp.src('client/app/app.<%= styleExt %>')
        .pipe(plugins.inject(gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false}), {
            starttag: '// injector',
            endtag: '// endinjector',
            transform: (filepath) => '@import \'' + filepath.replace('/client/app/', '').replace('/client/components/', '../components/') + '\';'
        }))
        .pipe(gulp.dest('client/app'));
});

gulp.task('styles', styles);<% if(filters.babel || filters.coffee) { %>

gulp.task('transpile', () => {
    return gulp.src(paths.client.scripts)
        .pipe(transpile())
        .pipe(gulp.dest('.tmp'));
});<% } %>

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, blob => '!' + blob)))
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
    gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts());
});

gulp.task('clean:tmp', () => gulp.src('.tmp', {read: false}).pipe(plugins.clean()));

gulp.task('start:client', [<% if(filters.coffee) { %>'coffee', <% } %>'styles'], cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require('./server/config/environment');
    nodemon('-w lib server/app.js')
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test);

    plugins.livereload.listen();

    plugins.watch(paths.client.styles)
        .pipe(plugins.plumber())
        .pipe(styles())
        .pipe(plugins.livereload());

    plugins.watch(paths.views.files)
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts)
        .pipe(plugins.plumber())<% if(filters.babel || filters.coffee) { %>
        .pipe(transpile())
        .pipe(gulp.dest('.tmp/scripts'))<% } %>
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts());

    gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', cb => {
    runSequence('clean:tmp',
        ['lint:scripts'],
        'inject:js',
        'inject:css',
        'bower',
        ['start:server', 'start:client'],
        'watch',
        cb);
});

gulp.task('test:server', () => {
    process.env.NODE_ENV = 'test';
    return gulp.src(paths.server.test)
        .pipe(plugins.mocha({reporter: 'spec'}));
});

gulp.task('test:client', () => {
    var testFiles = _.union(paths.client.testRequire, paths.client.test)
    return gulp.src(testFiles)
        .pipe(plugins.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

// inject bower components
gulp.task('bower', () => {
    gulp.src(paths.views.main)
        .pipe(wiredep({
            exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
        }))
        .pipe(gulp.dest('client/'));
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
    runSequence(
        'clean:dist',
        'inject',
        'bower',
        [
            'build:images',
            'copy:extras',
            'copy:fonts',
            'copy:server',
            'build:client'
        ],
        cb);
});

gulp.task('clean:dist', () => gulp.src('dist', {read: false}).pipe(plugins.clean()));

gulp.task('build:client', ['transpile', 'styles', 'html'], () => {
    var appFilter = plugins.filter('**/app.js');
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');
    var htmlFilter = plugins.filter('**/*.html');<% if(filters.jade) { %>
    var assetsFilter = plugins.filter('**/*.{js,css}');<% } %>

    let assets = plugins.useref.assets({searchPath: ['client', '.tmp']});

    return gulp.src(paths.views.main)<% if(filters.jade) { %>
        .pipe(plugins.jade({pretty: true}))<% } %>
        .pipe(assets)
        .pipe(appFilter)
            .pipe(plugins.addSrc.append('.tmp/templates.js'))
            .pipe(plugins.concat('app\\app.js'))
        .pipe(appFilter.restore())
        .pipe(jsFilter)
            .pipe(plugins.ngmin())
            .pipe(plugins.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
            .pipe(plugins.minifyCss({cache: true}))
        .pipe(cssFilter.restore())
        .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(plugins.revReplace())
        .pipe(plugins.useref())<% if(filters.jade) { %>
        .pipe(assetsFilter)<% } %>
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('html', function () {
    return gulp.src('client/{app,components}/**/*.html')
        .pipe(plugins.angularTemplatecache({
            module: 'testApp'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:images', () => {
    gulp.src('client/assets/images/**/*')
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.dist + '/public/assets/images'));
});

gulp.task('copy:extras', () => {
    gulp.src([
        'client/favicon.ico',
        'client/robots.txt'
    ], { dot: true })
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('copy:fonts', () => {
    gulp.src(yeoman.app + '/fonts/**/*')
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('copy:server', () => {
    gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc',
        'server/**/*'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
