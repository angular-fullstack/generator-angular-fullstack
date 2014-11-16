module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      gruntfile: 'Gruntfile.js',
      test: {
        options: {
          globals: {
            describe: true,
            it: true,
            beforeEach: true,
            afterEach: true,
            before: true,
            after: true
          }
        },
        src: ['test/*.js', 'directive/*.js', 'service/*.js', 'view/*.js', 'filter/*.js']
      }
    },
    watch: {
      files: [
        'Gruntfile.js',
        '<%= jshint.test.src %>'
      ],
      tasks: [
        'jshint',
        'mochaTest'
      ]
    },
    mochaTest: {
      test: {
        options: {
          slow: 1500,
          timeout: 50000,
          reporter: 'nyan'
        },
        src: ['test/*.js']
      }
    },
    release: {
      options: {
        bump: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('default', ['jshint', 'mochaTest', 'watch']);
};