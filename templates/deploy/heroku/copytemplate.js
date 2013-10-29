  clean: {
    dist: {
      files: [{
        src: [
          'heroku/*',
          '!heroku/.git*',
          '!heroku/Procfile'            
        ]
      }]
    },
  },
  copy: {
    heroku: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= yeoman.dist %>',
        dest: 'heroku/public',
        src: [
          '**/**'
        ]
      }, {
        expand: true,
        dest: 'heroku',
        src: [
          'package.json',
          'server.js',
          'lib/**/*'
        ]
      }]
    }
  }
  
  grunt.registerTask('build', [
    'copy:heroku'
  ]);
