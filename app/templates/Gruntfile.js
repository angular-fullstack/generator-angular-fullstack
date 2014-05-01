'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js',
          node_env: 'production'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: ['<%%= yeoman.app %>/components/**/*.js', '!<%%= yeoman.app %>/components/**/*.{spec,e2e}.js'],
        tasks: ['injector:components'],
        options: {
          event: ['added', 'deleted'],
        }
      },
      injectCss: {
        files: ['<%%= yeoman.app %>/components/**/*.css'],
        tasks: ['injector:css'],
        options: {
          event: ['added', 'deleted']
        }
      },
      js: {
        files: ['<%%= yeoman.app %>/components/**/*.js', '!<%%= yeoman.app %>/components/**/*.{spec,e2e}.js'],
        options: {
          livereload: true
        }
      },
      mochaTest: {
        files: ['server/components/**/*.spec.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: ['<%%= yeoman.app %>/components/**/*.spec.js'],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectSass: {
        files: ['<%%= yeoman.app %>/components/**/*.{scss,sass}'],
        tasks: ['injector:sass'],
        options: {
          event: ['added', 'deleted']
        }
      },
      sass: {
        files: ['<%%= yeoman.app %>/components/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      injectLess: {
        files: ['<%%= yeoman.app %>/components/**/*.less'],
        tasks: ['injector:less'],
        options: {
          event: ['added', 'deleted']
        }
      },
      less: {
        files: ['<%%= yeoman.app %>/components/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      jade: {
        files: ['<%%= yeoman.app %>/components/**/*.jade'],
        tasks: ['jade']
      },
      coffee: {
        files: [
          '<%%= yeoman.app %>/components/**/*.{coffee,litcoffee,coffee.md}',
          '!<%%= yeoman.app %>/components/**/*.spec.{coffee,litcoffee,coffee.md}'
        ],
        tasks: ['newer:coffee:compile']
      },
      coffeeTest: {
        files: ['<%%= yeoman.app %>/components/**/*.spec.{coffee,litcoffee,coffee.md}'],
        tasks: ['newer:coffee:compile', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%%= yeoman.app %>}/app.css',
          '<%%= yeoman.app %>/components/{,*//*}*.css',
          '{.tmp,<%%= yeoman.app %>}/components/{,*//*}*.html',
          '{.tmp,<%%= yeoman.app %>}/components/{,*//*}*.js',
          '!<%%= yeoman.app %>/components/**/*.spec.js',
          '<%%= yeoman.app %>/components/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [ 'server/{,*/}*.js']
      },
      all: [
        '<%%= yeoman.app %>/components/**/*.js',
        '<%%= yeoman.app %>/components/**/*.{spec,e2e}.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist %>/*',
            '!<%%= yeoman.dist %>/.git*',
            '!<%%= yeoman.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
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
        script: 'server/app.js',
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

    // Automatically inject Bower components into the app
    bowerInstall: {
      target: {
        src: '<%%= yeoman.app %>/index.html',
        ignorePath: '<%%= yeoman.app %>/',
        exclude: ['bootstrap-sass']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%%= yeoman.dist %>/public/{,*/}*.js',
            '<%%= yeoman.dist %>/public/{,*/}*.css',
            '<%%= yeoman.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%%= yeoman.dist %>/public/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%%= yeoman.app %>/index.html'],
      options: {
        dest: '<%%= yeoman.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%%= yeoman.dist %>/public/{,*/}*.html'],
      css: ['<%%= yeoman.dist %>/public/{,*/}*.css'],
      js: ['<%%= yeoman.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: ['<%%= yeoman.dist %>/public', '<%%= yeoman.dist %>/public/images'],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      options : {
        cache: false
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%%= yeoman.dist %>/public/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= yeoman.dist %>/public/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: require('./bower.json').name + 'App',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app.js'
      },
      main: {
        cwd: '<%%= yeoman.app %>',
        src: ['components/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['components/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%%= yeoman.dist %>/views/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'index.html',
            'fonts/**/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%%= yeoman.dist %>/public/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%%= yeoman.dist %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%%= yeoman.app %>',
        dest: '.tmp/',
        src: '**/*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'coffee',
        'jade',
        'sass',
        'less'
      ],
      test: [
        'coffee',
        'jade',
        'sass',
        'less'
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
      dist: [
        'coffee',
        'jade',
        'sass',
        'less',
        'imagemin',
        'svgmin'
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
        reporter: 'spec'
      },
      src: ['server/components/**/*.spec.js']
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
      }
    },

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
          cwd: '<%%= yeoman.app %>/components',
          src: '{,*/}*.jade',
          dest: '.tmp/components',
          ext: '.html'
        }]
      }
    },

    // Compiles CoffeeScript to JavaScript
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      compile: {
        files: [{
          expand: true,
          cwd: 'client',
          src: [
            'app.coffee',
            'components/{,*/}*.coffee'
          ],
          dest: '.tmp',
          ext: '.js'
        }]
      }
    },

    // Compiles Sass to CSS
    sass: {
      server: {
        files: {
          '.tmp/app.css' : '<%%= yeoman.app %>/app.scss'
        }
      }
    },

    // Compiles Less to CSS
    less: {
      server: {
        files: {
          '.tmp/app.css' : '<%%= yeoman.app %>/app.less'
        }
      },
    },

    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      components: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            console.log(filePath);
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%%= yeoman.app %>/index.html': [
            '{.tmp,<%%= yeoman.app %>}/components/**/*.js',
            '!{.tmp,<%%= yeoman.app %>}/components/**/*.{spec,e2e}.js'
          ]
        }
      },

      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%%= yeoman.app %>/app.scss': [
            '<%%= yeoman.app %>/components/**/*.{scss,sass}'
          ]
        }
      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%%= yeoman.app %>/app.less': [
            '<%%= yeoman.app %>/components/**/*.less'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%%= yeoman.app %>/index.html': [
            '<%%= yeoman.app %>/components/**/*.css'
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
    }, 500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'concurrent:server',
        'injector',
        'bowerInstall',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'injector',
      'bowerInstall',
      'autoprefixer',
      'express:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:test',
        'mochaTest'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    }

    else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:test',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'express:dev',
        'protractor'
      ]);
    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'injector',
    'bowerInstall',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
