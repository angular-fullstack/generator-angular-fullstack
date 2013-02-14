'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%%= yeoman.app %>/scripts/*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%%= yeoman.app %>/styles/*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%%= yeoman.app %>/*.html',
          '{.tmp,<%%= yeoman.app %>}/styles/*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/*.js',
          '<%%= yeoman.app %>/images/*.{png,jpg,jpeg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9000,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9000,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%%= connect.livereload.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%%= yeoman.app %>/scripts/*.js',
        'test/spec/*.js'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%%= connect.test.options.port %>/index.html']
        }
      }
    },
    coffee: {
        dist: {
            files: {
                '.tmp/scripts/coffee.js': '<%%= yeoman.app %>/scripts/*.coffee'
            }
        },
        test: {
            files: [{
                expand: true,
                cwd: '.tmp/spec',
                src: '*.coffee',
                dest: 'test/spec'
            }]
        }
    },
    compass: {
        options: {
            sassDir: '<%%= yeoman.app %>/styles',
            cssDir: '.tmp/styles',
            imagesDir: '<%%= yeoman.app %>/images',
            javascriptsDir: '<%%= yeoman.app %>/scripts',
            fontsDir: '<%%= yeoman.app %>/styles/fonts',
            importPath: 'app/components',
            relativeAssets: true
        },
        dist: {},
        server: {
            options: {
                debugInfo: true
            }
        }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
        dist: {}
    },*/
    <% if (includeRequireJS) { %>requirejs: {
        dist: {
            // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
            options: {
                // `name` and `out` is set by grunt-usemin
                baseUrl: 'app/scripts',
                optimize: 'none',
                // TODO: Figure out how to make sourcemaps work with grunt-usemin
                // https://github.com/yeoman/grunt-usemin/issues/30
                //generateSourceMaps: true,
                // required to support SourceMaps
                // http://requirejs.org/docs/errors.html#sourcemapcomments
                preserveLicenseComments: false,
                useStrict: true,
                wrap: true,
                //uglify2: {} // https://github.com/mishoo/UglifyJS2
                mainConfigFile: 'app/scripts/main.js'
            }
        }
    },<% } else { %>
    uglify: {
        dist: {
            files: {
                '<%%= yeoman.dist %>/scripts/main.js': [
                    '.tmp/scripts/*.js',
                    '<%%= yeoman.app %>/scripts/*.js'
                ],
            }
        }
    },<% } %>
    useminPrepare: {
        html: '<%%= yeoman.app %>/index.html',
        options: {
            dest: '<%%= yeoman.dist %>'
        }
    },
    usemin: {
        html: ['<%%= yeoman.dist %>/*.html'],
        css: ['<%%= yeoman.dist %>/styles/*.css'],
        options: {
            dirs: ['<%%= yeoman.dist %>']
        }
    },
    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%%= yeoman.app %>/images',
                src: '*.{png,jpg,jpeg}',
                dest: '<%%= yeoman.dist %>/images'
            }]
        }
    },
    cssmin: {
        dist: {
            files: {
                '<%%= yeoman.dist %>/styles/main.css': [
                    '.tmp/styles/*.css',
                    '<%%= yeoman.app %>/styles/*.css'
                ]
            }
        }
    },
    htmlmin: {
        dist: {
            options: {
                /*removeCommentsFromCDATA: true,
                // https://github.com/yeoman/grunt-usemin/issues/44
                //collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true*/
            },
            files: [{
                expand: true,
                cwd: '<%%= yeoman.app %>',
                src: '*.html',
                dest: '<%%= yeoman.dist %>'
            }]
        }
    },
    copy: {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%%= yeoman.app %>',
                dest: '<%%= yeoman.dist %>',
                src: [
                    '*.{ico,txt}',
                    '.htaccess'
                ]
            }]
        }
    },
    bower: {
        rjsConfig: 'app/scripts/main.js',
        indent: '    '
    }
  });

  grunt.renameTask('regarde', 'watch');
  // remove when mincss task is renamed
  grunt.renameTask('mincss', 'cssmin');

  grunt.registerTask('server', [
      'clean:server',
      'coffee:dist',
      'compass:server',
      'livereload-start',
      'connect:livereload',
      'open',
      'watch'
  ]);

  grunt.registerTask('test', [
      'clean:server',
      'coffee',
      'compass',
      'connect:test',
      'mocha'
  ]);

  grunt.registerTask('build', [
      'clean:dist',
      'jshint',
      'test',
      'coffee',
      'compass:dist',
      'useminPrepare',<% if (includeRequireJS) { %>
      'requirejs',<% } %>
      'imagemin',
      'cssmin',
      'htmlmin',
      'concat',
      'uglify',
      'copy',
      'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};