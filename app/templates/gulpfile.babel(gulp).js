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
import {Server as KarmaServer} from 'karma';
import runSequence from 'run-sequence';
import {protractor, webdriver_update} from 'gulp-protractor';<% if(filters.stylus) { %>
import nib from 'nib';<% } %>

var plugins = gulpLoadPlugins();
var config;

const clientPath = require('./bower.json').appPath || 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).<%= scriptExt %>`,
            `!${clientPath}/bower_components/**/*.js`
        ],
        styles: [`${clientPath}/{app,components}/**/*.<%= styleExt %>`],
        mainStyle: `${clientPath}/app/app.<%= styleExt %>`,
        views: `${clientPath}/{app,components}/**/*.<%= templateExt %>`,
        mainView: `${clientPath}/index.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.<%= scriptExt %>`],
        e2e: ['e2e/**/*.spec.js'],
        bower: `${clientPath}/bower_components/`
    },
    server: {
        scripts: [`${serverPath}/**/!(*.spec|*.integration).<%= scriptExt %>`],
        json: [`${serverPath}/**/*.json`],
        test: {
          integration: `${serverPath}/**/*.integration.js`,
          unit: `${serverPath}/**/*.spec.js`
        }
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

function sortModulesFirst(a, b) {
    var module = /\.module\.js$/;
    var aMod = module.test(a.path);
    var bMod = module.test(b.path);
    // inject *.module.js first
    if (aMod === bMod) {
        // either both modules or both non-modules, so just sort normally
        if (a.path < b.path) {
            return -1;
        }
        if (a.path > b.path) {
            return 1;
        }
        return 0;
    } else {
        return (aMod ? -1 : 1);
    }
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, `${clientPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');<% } %>

let lintServerScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');<% } %>

let lintServerTestScripts = lazypipe()<% if(filters.coffee) { %>
    .pipe(plugins.coffeelint)
    .pipe(plugins.coffeelint.reporter);<% } else { %>
    .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
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

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)<% if(filters.babel) { %>
    .pipe(plugins.babel, {
        optional: ['runtime']
    })<% } else { %>
    .pipe(plugins.coffee, {bare: true})<% } %>
    .pipe(plugins.sourcemaps.write, '.');

let transpileClient = lazypipe()
    .pipe(plugins.sourcemaps.init)<% if(filters.babel) { %>
    .pipe(plugins.babel, {
        optional: ['es7.classProperties']
    })<% } else { %>
    .pipe(plugins.coffee, {bare: true})<% } %>
    .pipe(plugins.sourcemaps.write, '.');<% } %>

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.babelIstanbul.writeReports)
    .pipe(plugins.babelIstanbul.enforceThresholds, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        }
    });

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
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
            gulp.src(_.union(paths.client.scripts, [`!${clientPath}/**/*.{spec,mock}.js`, `!${clientPath}/app/app.js`]), {read: false})
                .pipe(plugins.sort(sortModulesFirst)),
            {
                starttag: '<!-- injector:js -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<script src="' + filepath.replace(`/${clientPath}/`, '') + '"></script>'
            }))
        .pipe(gulp.dest(clientPath));
});

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src('/${clientPath}/{app,components}/**/*.css', {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '<!-- injector:css -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace(`/${clientPath}/`, '').replace('/.tmp/', '') + '">'
            }))
        .pipe(gulp.dest(clientPath));
});

gulp.task('inject:<%= styleExt %>', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '// injector',
                endtag: '// endinjector',
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/${clientPath}/app/`, '')
                        .replace(`/${clientPath}/components/`, '../components/')
                        .replace(/_(.*).<%= styleExt %>/, (match, p1, offset, string) => p1)
                        .replace('.<%= styleExt %>', '');
                    return `@import '${newPath}';`;
                }
            }))
        .pipe(gulp.dest(`${clientPath}/app`));
});

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});<% if(filters.babel || filters.coffee) { %>

gulp.task('transpile:client', () => {
    return gulp.src(paths.client.scripts)
        .pipe(transpileClient())
        .pipe(gulp.dest('.tmp'));
});<% } %>

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
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

gulp.task('lint:scripts:clientTest', () => {
    return gulp.src(paths.client.test)
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:serverTest', () => {
    return gulp.src(paths.server.test)
        .pipe(lintServerTestScripts());
});

gulp.task('jscs', () => {
  return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
      .pipe(plugins.jscs())
      .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        cb();
    });
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

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
        .pipe(transpileClient())
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

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod', 'start:client'],
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
        'mocha:integration',
        //'mocha:coverage',
        cb);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
});

gulp.task('mocha:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha());
});

gulp.task('test:client', (done) => {
    new KarmaServer({
      configFile: `${__dirname}/${paths.karma}`,
      singleRun: true
    }, done).start();
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
            ignorePath: clientPath
        }))
        .pipe(gulp.dest(`${clientPath}/`));
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
        'clean:tmp',
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

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('build:client', ['transpile:client', 'styles', 'html'], () => {
    var manifest = gulp.src(`${paths.dist}/${clientPath}/assets/rev-manifest.json`);

    var appFilter = plugins.filter('**/app.js');
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');
    var htmlBlock = plugins.filter(['**/*.!(html)']);<% if(filters.jade) { %>
    var assetsFilter = plugins.filter('**/*.{js,css}');<% } %>

    return gulp.src(paths.client.mainView)<% if(filters.jade) { %>
        .pipe(plugins.jade({pretty: true}))<% } %>
        .pipe(plugins.useref())
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
            .pipe(htmlBlock)
                .pipe(plugins.rev())
            .pipe(htmlBlock.restore())
        .pipe(plugins.revReplace({manifest}))<% if(filters.jade) { %>
        .pipe(assetsFilter)<% } %>
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('html', function() {
    return gulp.src(`${clientPath}/{app,components}/**/*.html`)
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
  let sharedConfig = require(`./${serverPath}/config/environment/shared`);
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
    .pipe(gulp.dest(`${clientPath}/app/`))
})

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(`${paths.dist}/${clientPath}/assets/rev-manifest.json`, {
            base: `${paths.dist}/${clientPath}/assets`,
            merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
    return gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});

gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    // Covering files
    .pipe(plugins.babelIstanbul())
    // Force `require` to return covered files
    .pipe(plugins.babelIstanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha())
        .pipe(istanbul())
        // Creating the reports after tests ran
});

gulp.task('coverage:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha())
        .pipe(istanbul())
        // Creating the reports after tests ran
});

gulp.task('mocha:coverage', cb => {
  runSequence('coverage:pre',
              'env:all',
              'env:test',
              'coverage:unit',
              'coverage:integration',
              cb);
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
    gulp.src(paths.client.e2e)
        .pipe(protractor({
            configFile: 'protractor.conf.js',
        })).on('error', err => {
            console.log(err)
        }).on('end', () => {
            process.exit();
        });
});
