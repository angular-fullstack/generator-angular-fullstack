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
            'client/**/*.<% if(filters.coffee) { %>coffee<% } else { %>js<% } %>',
            '!client/bower_components/**/*.js'
        ],
        styles: ['client/{app, components}/**/*.<% if(filters.stylus) { %>styl<% } else if (filters.sass) { %>scss<% } else { %>css<% } %>'],
        test: ['client/**/*.spec.<% if(filters.coffee) { %>coffee<% } else { %>js<% } %>'],
        testRequire: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-route/angular-route.js',<% if(filters.coffee) { %>
            'client/**/*.spec.coffee'<% } else { %>
            'client/**/*.spec.js'<% } %>
        ],
        bower: 'client/bower_components/'
    },
    server: {<% if(filters.coffee) { %>
        scripts: ['server/**/*.coffee'],
        test: ['server/**/*.spec.coffee'],<% } else { %>
        scripts: ['server/**/*.js'],
        test: ['server/**/*.spec.js'],<% } %>
    },
    views: {<% if(filters.jade) { %>
        main: 'client/index.jade',
        files: ['client/app/**/*.jade']<% } else {%>
        main: 'client/index.html',
        files: ['client/app/**/*.html']<% } %>
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

//////////////////////
// Helper functions //
//////////////////////

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') + plugins.util.colors.yellow('nodemon') + plugins.util.colors.white('] ') + log.message);
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

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, '.jshintrc')
    .pipe(plugins.jshint.reporter, 'jshint-stylish');<% } %>

let styles = lazypipe()
    .pipe(gulp.src, paths.client.styles)
    .pipe(plugins.sourcemaps.init)<% if(filters.stylus) { %>
    .pipe(plugins.stylus, {
        use: [nib()],
        errors: true
    })<% } if(filters.sass) { %>
    .pipe(plugins.sass)<% } %>
    .pipe(plugins.sourcemaps.write, '.')
    // .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})  //seems to break this
    .pipe(gulp.dest, '.tmp');

///////////
// Tasks //
///////////

gulp.task('inject', cb => {
    runSequence(['inject:js', 'inject:css'], cb);
});

gulp.task('inject:js', () => {
    return gulp.src(paths.views.main)
        .pipe(plugins.inject(gulp.src(_.union(
            paths.client.scripts
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

gulp.task('styles', styles);<% if(filters.coffee) { %>

gulp.task('coffee', () =>
    gulp.src(paths.client.scripts)
        .pipe(lintScripts())
        .pipe(plugins.coffee({bare: true}).on('error', plugins.util.log))
        .pipe(gulp.dest('.tmp/scripts'));
);<% } %>

gulp.task('lint:scripts', () => gulp.src(_.union(paths.client.scripts, paths.server.scripts)).pipe(lintScripts()));

gulp.task('clean:tmp', () => gulp.src('.tmp', {read: false}).pipe(plugins.clean()));

gulp.task('start:client', [<% if(filters.coffee) { %>'coffee', <% } %>'styles'], (callback) => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        callback();
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

    plugins.watch(paths.client.styles)
        .pipe(plugins.plumber())
        .pipe(styles())
        .pipe(plugins.livereload());

    plugins.watch(paths.views.files)
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts)
        .pipe(plugins.plumber())
        .pipe(lintScripts())<% if(filters.coffee) { %>
        .pipe(plugins.coffee({bare: true}).on('error', plugins.util.log))
        .pipe(gulp.dest('.tmp/scripts'))<% } %>
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintScripts());

    gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', (callback) => {
    runSequence('clean:tmp',
        ['lint:scripts'],
        'inject:js',
        'inject:css',
        'bower',
        ['start:server', 'start:client'],
        'watch',
        callback);
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

///////////
// Build //
///////////

gulp.task('build', (callback) => {
    runSequence('clean:dist',
        ['images', 'copy:extras', 'copy:fonts', 'copy:server', 'client:build'],
        callback);
});

gulp.task('clean:dist', () => gulp.src('dist', {read: false}).pipe(plugins.clean()));

gulp.task('client:build', ['html'], () => {
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');<% if(filters.jade) { %>
    var assets = plugins.filter('**/*.{js,css}');<% } %>

    return gulp.src(paths.views.main)<% if(filters.jade) { %>
        .pipe(plugins.jade({pretty: true}))<% } %>
        .pipe(plugins.useref.assets({searchPath: [yeoman.app, '.tmp']}))
        .pipe(jsFilter)
        .pipe(plugins.ngmin())
        .pipe(plugins.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(plugins.minifyCss({cache: true}))
        .pipe(cssFilter.restore())
        .pipe(plugins.rev())
        .pipe(plugins.useref.restore())
        .pipe(plugins.revReplace())
        .pipe(plugins.useref())<% if(filters.jade) { %>
        .pipe(assets)<% } %>
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('html', () => {
    gulp.src(yeoman.app + '/views/**/*')
        .pipe(gulp.dest(paths.dist + '/public/views'));
});

gulp.task('images', () => {
    gulp.src(yeoman.app + '/images/**/*')
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.dist + '/public/images'));
});

gulp.task('copy:extras', () => {
    gulp.src(yeoman.app + '/*.*', { dot: true })
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('copy:fonts', () => {
    gulp.src(yeoman.app + '/fonts/**/*')
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('copy:server', () => {
    gulp.src([
        'package.json',
        'server.js',
        'lib/**/*'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
