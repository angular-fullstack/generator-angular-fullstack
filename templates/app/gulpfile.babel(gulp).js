// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= rootGeneratorName() %> <%= rootGeneratorVersion() %>
'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import {Server as KarmaServer} from 'karma';
import runSequence from 'run-sequence';
import {protractor, webdriver_update} from 'gulp-protractor';
import {Instrumenter} from 'isparta';<% if(filters.stylus) { %>
import nib from 'nib';<% } %>
import webpack from 'webpack-stream';
import makeWebpackConfig from './webpack.make';

var plugins = gulpLoadPlugins();
var config;
const webpackDevConfig = makeWebpackConfig({ DEV: true });
const webpackE2eConfig = makeWebpackConfig({ E2E: true });
const webpackDistConfig = makeWebpackConfig({ BUILD: true });
const webpackTestConfig = makeWebpackConfig({ TEST: true });

const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).<%= scriptExt %>`,
            `!${clientPath}/bower_components/**/*`<% if(filters.ts) { %>,
            `!${clientPath}/{typings,test_typings}/**/*`<% } %>
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
        scripts: [
          `${serverPath}/**/!(*.spec|*.integration).js`,
          `!${serverPath}/config/local.env.sample.js`
        ],
        json: [`${serverPath}/**/*.json`],
        test: {
          integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
          unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
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

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()<% if(filters.babel) { %>
    .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
    .pipe(plugins.eslint.format);<% } %><% if(filters.ts) { %>
    .pipe(plugins.tslint, require(`./${clientPath}/tslint.json`))
    .pipe(plugins.tslint.report, 'verbose', {emitError: false});<% } %>

const lintClientTestScripts = lazypipe()
    <%_ if(filters.babel) { -%>
    .pipe(plugins.eslint, {
        configFile: `${clientPath}/.eslintrc`,
        envs: [
            'browser',
            'es6',
            'mocha'
        ]
    })
    .pipe(plugins.eslint.format);
    <%_ } -%>
    <%_ if(filters.ts) { -%>
    .pipe(plugins.tslint, require(`./${clientPath}/tslint.json`))
    .pipe(plugins.tslint.report, 'verbose', {emitError: false});
    <%_ } -%>

let lintServerScripts = lazypipe()
    .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
    .pipe(plugins.eslint.format);

let lintServerTestScripts = lazypipe()
    .pipe(plugins.eslint, {
        configFile: `${serverPath}/.eslintrc`,
        envs: [
            'node',
            'es6',
            'mocha'
        ]
    })
    .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports)
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory : ''
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
    runSequence(['inject:css'<% if(!filters.css) { %>, 'inject:<%= styleExt %>'<% } %><% if(filters.ts) { %>, 'inject:tsconfig'<% } %>], cb);
});<% if(filters.ts) { %>

function injectTsConfig(filesGlob, tsconfigPath){
    let src = gulp.src(filesGlob, {read: false})
        .pipe(plugins.sort());

    return gulp.src(tsconfigPath)
        .pipe(plugins.inject(src, {
            starttag: '"files": [',
            endtag: ']',
            transform: (filepath, file, i, length) => {
                return `"${filepath.substr(1)}"${i + 1 < length ? ',' : ''}`;
            }
        }))
        .pipe(gulp.dest('./'));
}

gulp.task('inject:tsconfig', () => {
    return injectTsConfig([
        `${clientPath}/**/!(*.spec|*.mock).ts`,
        `!${clientPath}/bower_components/**/*`,
        `typings/main.d.ts`
    ],
    './tsconfig.client.json');
});

gulp.task('inject:tsconfigTest', () => {
    return injectTsConfig([
        `${clientPath}/**/+(*.spec|*.mock).ts`,
        `!${clientPath}/bower_components/**/*`,
        `typings/main.d.ts`
    ],
    './tsconfig.client.test.json');
});<% } %>

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src(`${clientPath}/{app,components}/**/*.css`, {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '<!-- injector:css -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace(`/${clientPath}/`, '').replace('/.tmp/', '') + '">'
            }))
        .pipe(gulp.dest(clientPath));
});<% if(!filters.css) { %>

gulp.task('inject:<%= styleExt %>', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
            {
                <%_ if(filters.stylus) { _%>
                starttag: '/* inject:styl */',
                endtag: '/* endinject */',
                <%_ } _%>
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
});<% } %>

gulp.task('webpack:dev', function() {
    return gulp.src(webpackDevConfig.entry.app)
        .pipe(plugins.plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('.tmp'))
        .pipe(plugins.livereload());
});

gulp.task('webpack:dist', function() {
    return gulp.src(webpackDistConfig.entry.app)
        .pipe(webpack(webpackDistConfig))
        .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task('webpack:test', function() {
    return gulp.src(webpackTestConfig.entry.app)
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:e2e', function() {
    return gulp.src(webpackE2eConfig.entry.app)
        .pipe(webpack(webpackE2eConfig))
        .pipe(gulp.dest('.tmp'));
});<% if(filters.ts) { %>

// Install DefinitelyTyped TypeScript definition files
gulp.task('typings', () => {
    return gulp.src("./typings.json")
        .pipe(plugins.typings());
});<% } %>

gulp.task('styles', () => {
    <%_ if(!filters.css) { _%>
    return gulp.src(paths.client.mainStyle)
    <%_ } else { _%>
    return gulp.src(paths.client.styles)
    <%_ } _%>
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});<% if(filters.ts) { %>

gulp.task('copy:constant', ['constant'], () => {
    return gulp.src(`${clientPath}/app/app.constant.js`, { dot: true })
        .pipe(gulp.dest('.tmp/app'));
});<% } %>

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    return gulp.src(_.union(
        paths.client.scripts,
        _.map(paths.client.test, blob => '!' + blob),
        [`!${clientPath}/app/app.constant.<%= scriptExt %>`]
    ))
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

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:inspector', () => {
    gulp.src([])
        .pipe(plugins.nodeInspector());
});

gulp.task('start:server:debug', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} --debug-brk ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

    plugins.livereload.listen();

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts())
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration))
        .pipe(plugins.plumber())
        .pipe(lintServerTestScripts());
});

gulp.task('serve', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'constant',
            'inject',
            'copy:fonts:dev',
            'env:all'<% if(filters.ts) { %>,
            'typings'<% } %>
        ],
        // 'webpack:dev',
        ['start:server', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('serve:debug', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'constant',
            'inject',
            'copy:fonts:dev',
            'env:all'<% if(filters.ts) { %>,
            'typings'<% } %>
        ],
        'webpack:dev',
        'start:inspector',
        ['start:server:debug', 'start:client'],
        'watch',
        cb
    );
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

gulp.task('test:server:coverage', cb => {
  runSequence('coverage:pre',
              'env:all',
              'env:test',
              'coverage:unit',
              'coverage:integration',
              cb);
});

gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    // Covering files
    .pipe(plugins.istanbul({
        instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
        includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
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

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['webpack:e2e', 'constant', 'env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
    gulp.src(paths.client.e2e)
        .pipe(protractor({
            configFile: 'protractor.conf.js',
        }))
        .on('error', e => { throw e })
        .on('end', () => { process.exit() });
});

gulp.task('test:client', ['constant'], done => {
    new KarmaServer({
      configFile: `${__dirname}/${paths.karma}`,
      singleRun: true
    }, err => {
        done(err);
        process.exit(err);
    }).start();
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'inject',
        [
            'transpile:client',
            'transpile:server'
        ],
        [
            'build:images',
            'generate-favicon',
            'typings'
        ],
        [
            'copy:extras',
            'copy:assets',
            'copy:fonts:dist',
            'copy:server',
            'webpack:dist'
        ],
        'revReplaceWebpack',
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('constant', function() {
  let sharedConfig = require(`./${serverPath}/config/environment/shared`);
  return plugins.ngConstant({
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
});

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

gulp.task('revReplaceWebpack', function() {
    return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({manifest: gulp.src(paths.client.assets.revManifest)}))
        .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

/**
 * turns 'boostrap/fonts/font.woff' into 'boostrap/font.woff'
 */
function flatten() {
    return through2.obj(function(file, enc, next) {
        if(!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch(e) {
                this.emit('error', new Error(e));
            }
        }
        next();
    });
}
gulp.task('copy:fonts:dev', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${clientPath}/assets/fonts`));
});
gulp.task('copy:fonts:dist', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
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

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
    buildcontrol: {
        options: {
            dir: paths.dist,
            commit: true,
            push: true,
            connectCommits: false,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        },
        heroku: {
            options: {
                remote: 'heroku',
                branch: 'master'
            }
        },
        openshift: {
            options: {
                remote: 'openshift',
                branch: 'master'
            }
        }
    }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', function(done) {
    grunt.tasks(
        ['buildcontrol:heroku'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function() {done();}
    );
});
gulp.task('buildcontrol:openshift', function(done) {
    grunt.tasks(
        ['buildcontrol:openshift'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function() {done();}
    );
});
