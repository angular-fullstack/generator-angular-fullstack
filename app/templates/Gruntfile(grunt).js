// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= rootGeneratorName() %> <%= rootGeneratorVersion() %>
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    buildcontrol: 'grunt-build-control',
    istanbul_check_coverage: 'grunt-mocha-istanbul',
    ngconstant: 'grunt-ng-constant'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      server: 'server',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: '<%%= yeoman.server %>',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%%= yeoman.dist %>/<%%= yeoman.server %>'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%%= express.options.port %>'
      }
    },
    watch: {<% if(filters.babel) { %>
      babel: {
        files: ['<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).js'],
        tasks: ['newer:babel:client']
      },<% } %><% if(filters.ts) { %>
      ts: {
        files: ['<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).ts'],
        tasks: ['ts:client']
      },<% } %>
      ngconstant: {
        files: ['<%%= yeoman.server %>/config/environment/shared.js'],
        tasks: ['ngconstant']
      },
      injectJS: {
        files: [
          '<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).<%= scriptExt %>',
          '!<%%= yeoman.client %>/app/app.js'
        ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.css'],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['<%%= yeoman.server %>/**/*.{spec,integration}.<%= scriptExt %>'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.{spec,mock}.<%= scriptExt %>'],
        tasks: [<% if(filters.babel) { %>'newer:jshint:all'<% } if(filters.ts) { %>'newer:tslint:all', 'newer:ts:client_test',<% } %>, 'wiredep:test', 'karma']
      },<% if (filters.stylus) { %>
      injectStylus: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.styl'],
        tasks: ['injector:stylus']
      },
      stylus: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.styl'],
        tasks: ['stylus', 'postcss']
      },<% } if (filters.sass) { %>
      injectSass: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['injector:sass']
      },
      sass: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['sass', 'postcss']
      },<% } if (filters.less) { %>
      injectLess: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['injector:less']
      },
      less: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['less', 'postcss']
      },<% } if (filters.jade) { %>
      jade: {
        files: ['<%%= yeoman.client %>/{app,components}/**/*.jade'],
        tasks: ['jade']
      },<% } %>
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%%= yeoman.client %>}/{app,components}/**/*.{css,html}',
          '{.tmp,<%%= yeoman.client %>}/{app,components}/**/!(*.spec|*.mock).<%= scriptExt %>',
          '<%%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['<%%= yeoman.server %>/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: '<%%= yeoman.server %>/.jshintrc'
        },
        src: ['<%%= yeoman.server %>/**/!(*.spec|*.integration).js']
      },
      serverTest: {
        options: {
          jshintrc: '<%%= yeoman.server %>/.jshintrc-spec'
        },
        src: ['<%%= yeoman.server %>/**/*.{spec,integration}.js']
      },
      all: ['<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).js'],
      test: {
        src: ['<%%= yeoman.client %>/{app,components}/**/*.{spec,mock}.js']
      }
    },<% if(filters.ts) { %>

    tslint: {
      options: {
        configuration: '<%%= yeoman.client %>/tslint.json'
      },
      all: {
        src: ['<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).ts']
      }
    },<% } %>

    jscs: {
      options: {
        config: ".jscsrc"
      },
      main: {
        files: {
          src: [
            '<%%= yeoman.client %>/app/**/*.js',
            '<%%= yeoman.server %>/**/*.js'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist %>/!(.git*|.openshift|Procfile)**'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: ['last 2 version']})
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: '<%%= yeoman.server %>',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app and karma.conf.js
    wiredep: {
      options: {
        exclude: [<% if(filters.uibootstrap) { %>
          /bootstrap.js/,<% } %>
          '/json3/',
          '/es5-shim/'<% if(!filters.css) { %>,
          /font-awesome\.css/<% if(filters.bootstrap) { %>,
          /bootstrap\.css/<% if(filters.sass) { %>,
          /bootstrap-sass-official/<% } if(filters.oauth) { %>,
          /bootstrap-social\.css/<% }}} %>
        ]
      },
      client: {
        src: '<%%= yeoman.client %>/index.html',
        ignorePath: '<%%= yeoman.client %>/',
      },
      test: {
        src: './karma.conf.js',
        devDependencies: true
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%%= yeoman.dist %>/<%%= yeoman.client %>/!(bower_components){,*/}*.{js,css}',
          '<%%= yeoman.dist %>/<%%= yeoman.client %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%%= yeoman.dist %>/<%%= yeoman.client %>/assets/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%%= yeoman.client %>/index.html'],
      options: {
        dest: '<%%= yeoman.dist %>/<%%= yeoman.client %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%%= yeoman.dist %>/<%%= yeoman.client %>/{,!(bower_components)/**/}*.html'],
      css: ['<%%= yeoman.dist %>/<%%= yeoman.client %>/!(bower_components){,*/}*.css'],
      js: ['<%%= yeoman.dist %>/<%%= yeoman.client %>/!(bower_components){,*/}*.js'],
      options: {
        assetsDirs: [
          '<%%= yeoman.dist %>/<%%= yeoman.client %>',
          '<%%= yeoman.dist %>/<%%= yeoman.client %>/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.client %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%%= yeoman.dist %>/<%%= yeoman.client %>/assets/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Dynamically generate angular constant `appConfig` from
    // `server/config/environment/shared.js`
    ngconstant: {
      options: {
        name: '<%= scriptAppName %>.constants',
        dest: '<%%= yeoman.client %>/app/app.constant.js',
        deps: [],
        wrap: true,
        configPath: '<%%= yeoman.server %>/config/environment/shared'
      },
      app: {
        constants: function() {
          return {
            appConfig: require('./' + grunt.config.get('ngconstant.options.configPath'))
          };
        }
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: '<%= scriptAppName %>',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: '<%%= yeoman.client %>',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%%= yeoman.dist %>/<%%= yeoman.client %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.client %>',
          dest: '<%%= yeoman.dist %>/<%%= yeoman.client %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%%= yeoman.dist %>/<%%= yeoman.client %>/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%%= yeoman.dist %>',
          src: [
            'package.json',
            '<%%= yeoman.server %>/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%%= yeoman.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }<% if(filters.ts) { %>,
      constant: {
        expand: true,
        cwd: '<%%= yeoman.client %>',
        dest: '.tmp/',
        src: ['app/app.constant.js']
      }<% } %>
    },

    buildcontrol: {
      options: {
        dir: '<%%= yeoman.dist %>',
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
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      pre: [<% if (filters.stylus) { %>
        'injector:stylus',<% } if (filters.less) { %>
        'injector:less',<% } if (filters.sass) { %>
        'injector:sass',<% } %>
        'ngconstant'<% if(filters.ts) { %>,
        'copy:constant'<% } %>
      ],
      server: [<% if(filters.babel) { %>
        'newer:babel:client',<% } if(filters.ts) { %>
        'ts:client',
        'copy:constant',<% } if(filters.jade) { %>
        'jade',<% } if(filters.stylus) { %>
        'stylus',<% } if(filters.sass) { %>
        'sass',<% } if(filters.less) { %>
        'less',<% } %>
      ],
      test: [<% if(filters.babel) { %>
        'newer:babel:client',<% } if(filters.ts) { %>
        'ts:client',
        'copy:constant',<% } if(filters.ts) { %>
        'ts:client_test',<% } if(filters.jade) { %>
        'jade',<% } if(filters.stylus) { %>
        'stylus',<% } if(filters.sass) { %>
        'sass',<% } if(filters.less) { %>
        'less',<% } %>
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [<% if(filters.babel) { %>
        'newer:babel:client',<% } if(filters.ts) { %>
        'ts:client',
        'copy:constant',<% } if(filters.jade) { %>
        'jade',<% } if(filters.stylus) { %>
        'stylus',<% } if(filters.sass) { %>
        'sass',<% } if(filters.less) { %>
        'less',<% } %>
        'imagemin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'mocha.conf.js',
        timeout: 5000 // set default mocha spec timeout
      },
      unit: {
        src: ['<%%= yeoman.server %>/**/*.spec.js']
      },
      integration: {
        src: ['<%%= yeoman.server %>/**/*.integration.js']
      }
    },

    mocha_istanbul: {
      unit: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.spec.js',
          coverageFolder: 'coverage/server/unit'
        },
        src: '<%%= yeoman.server %>'
      },
      integration: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.integration.js',
          coverageFolder: 'coverage/server/integration'
        },
        src: '<%%= yeoman.server %>'
      }
    },

    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage/**',
          check: {
            lines: 80,
            statements: 80,
            branches: 80,
            functions: 80
          }
        }
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },<% if (filters.jade) { %>

    // Compiles Jade to html
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.client %>',
          src: ['{app,components}/**/*.jade'],
          dest: '.tmp',
          ext: '.html'
        }]
      }
    },<% } %>

    // Compiles ES6 to JavaScript using Babel
    babel: {
      options: {
        sourceMap: true,
        optional: [
          'es7.classProperties'
        ]
      },<% if(filters.babel) { %>
      client: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.client %>',
          src: ['{app,components}/**/!(*.spec).js'],
          dest: '.tmp'
        }]
      },<% } %>
      server: {
        options: {
          optional: ['runtime']
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.server %>',
          src: ['**/*.js'],
          dest: '<%%= yeoman.dist %>/<%%= yeoman.server %>'
        }]
      }
    },<% if(filters.ts) { %>

    ts: {
      options: {
        sourceMap: true,
        failOnTypeErrors: false
      },
      client: {
        tsconfig: './tsconfig.client.json',
        outDir: '.tmp'
      },
      client_test: {
        tsconfig: './tsconfig.client.test.json',
        outDir: '.tmp/test'
      }
    },

    tsd: {
      install: {
        options: {
          command: 'reinstall',
          config: './tsd.json'
        }
      },
      install_test: {
        options: {
          command: 'reinstall',
          config: './tsd_test.json'
        }
      }
    },<% } %><% if(filters.stylus) { %>

    // Compiles Stylus to CSS
    stylus: {
      server: {
        options: {
          "include css": true
        },
        files: {
          '.tmp/app/app.css' : '<%%= yeoman.client %>/app/app.styl'
        }
      }
    },<% } if (filters.sass) { %>

    // Compiles Sass to CSS
    sass: {
      server: {
        options: {
          compass: false
        },
        files: {
          '.tmp/app/app.css' : '<%%= yeoman.client %>/app/app.scss'
        }
      }
    },<% } if (filters.less) { %>

    // Compiles Less to CSS
    less: {
      server: {
        files: {
          '.tmp/app/app.css' : '<%%= yeoman.client %>/app/app.less'
        }
      }
    },<% } %>

    injector: {
      options: {},
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/', '');
            filePath = filePath.replace('/.tmp/', '');<% if(filters.ts) { %>
            filePath = filePath.replace('.ts', '.js');<% } %>
            return '<script src="' + filePath + '"></script>';
          },
          sort: function(a, b) {
            var module = /\.module\.js$/;
            var aMod = module.test(a);
            var bMod = module.test(b);
            // inject *.module.js first
            return (aMod === bMod) ? 0 : (aMod ? -1 : 1);
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%%= yeoman.client %>/index.html': [
               [
                 '<%%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).<%= scriptExt %>',<% if(filters.ts) { %>
                 '<%%= yeoman.client %>/app/app.constant.js',<% } %>
                 '!{.tmp,<%%= yeoman.client %>}/app/app.{js,ts}'
               ]
            ]
        }
      },<% if (filters.stylus) { %>

      // Inject component styl into app.styl
      stylus: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/app/', '');
            filePath = filePath.replace('/' + yoClient + '/components/', '../components/');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%%= yeoman.client %>/app/app.styl': [
            '<%%= yeoman.client %>/{app,components}/**/*.styl',
            '!<%%= yeoman.client %>/app/app.styl'
          ]
        }
      },<% } if (filters.sass) { %>

      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/app/', '');
            filePath = filePath.replace('/' + yoClient + '/components/', '../components/');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%%= yeoman.client %>/app/app.scss': [
            '<%%= yeoman.client %>/{app,components}/**/*.{scss,sass}',
            '!<%%= yeoman.client %>/app/app.{scss,sass}'
          ]
        }
      },<% } if (filters.less) { %>

      // Inject component less into app.less
      less: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/app/', '');
            filePath = filePath.replace('/' + yoClient + '/components/', '../components/');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%%= yeoman.client %>/app/app.less': [
            '<%%= yeoman.client %>/{app,components}/**/*.less',
            '!<%%= yeoman.client %>/app/app.less'
          ]
        }
      },<% } %>

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%%= yeoman.client %>/index.html': [
            '<%%= yeoman.client %>/{app,components}/**/*.css'
          ]
        }
      }
    },
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:pre',<% if(filters.ts) { %>
        'tsd',<% } %>
        'concurrent:server',
        'injector',
        'wiredep:client',
        'postcss',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'concurrent:pre',<% if(filters.ts) { %>
      'tsd',<% } %>
      'concurrent:server',
      'injector',
      'wiredep:client',
      'postcss',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target, option) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest:unit',
        'mochaTest:integration'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:pre',<% if(filters.ts) { %>
        'ts:client',
        'ts:client_test',
        'tsd',<% } %>
        'concurrent:test',
        'injector',
        'postcss',
        'wiredep:test',
        'karma'
      ]);
    }

    else if (target === 'e2e') {

      if (option === 'prod') {
        return grunt.task.run([
          'build',
          'env:all',
          'env:prod',
          'express:prod',
          'protractor'
        ]);
      }

      else {
        return grunt.task.run([
          'clean:server',
          'env:all',
          'env:test',
          'concurrent:pre',<% if(filters.ts) { %>
          'tsd:install',
          'tsd:install_test',
          'ts:client',
          'ts:client_test',<% } %>
          'concurrent:test',
          'injector',
          'wiredep:client',
          'postcss',
          'express:dev',
          'protractor'
        ]);
      }
    }

    else if (target === 'coverage') {

      if (option === 'unit') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:unit'
        ]);
      }

      else if (option === 'integration') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:integration'
        ]);
      }

      else if (option === 'check') {
        return grunt.task.run([
          'istanbul_check_coverage'
        ]);
      }

      else {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul',
          'istanbul_check_coverage'
        ]);
      }

    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:pre',<% if(filters.ts) { %>
    'tsd',<% } %>
    'concurrent:dist',
    'injector',
    'wiredep:client',
    'useminPrepare',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'babel:server',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin'
  ]);

  grunt.registerTask('default', [<% if(filters.ts) { %>
    'newer:tslint',<% } %><% if(filters.babel) { %>
    'newer:jshint',<% } %>
    'test',
    'build'
  ]);
};
