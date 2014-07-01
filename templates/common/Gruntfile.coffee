# Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict'

# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'

module.exports = (grunt) ->

  # Load grunt tasks automatically
  require('load-grunt-tasks') grunt

  # Time how long tasks take. Can help when optimizing build times
  require('time-grunt') grunt

  # Define the configuration for all the tasks
  grunt.initConfig

    # Project settings
    yeoman:
      # configurable paths
      app: require('./bower.json').appPath ? 'app'
      dist: 'dist'
      lib: 'lib'
      tmp: '.tmp'

    express:
      options:
        port: process.env.PORT ? 9000
      dev:
        options:
          script: '<%%= yeoman.tmp %>/server.js'
          debug: true
      prod:
        options:
          script: '<%%= yeoman.dist %>/server.js'
          node_env: 'production'

    open:
      server:
        url: 'http://localhost:<%%= express.options.port %>'

    watch:
      coffee:
        files: [
          '<%%= yeoman.app %>/scripts/{,*/}*.{coffee,litcoffee,coffee.md}'
          '<%%= yeoman.lib %>/{,*/}*.{coffee,litcoffee,coffee.md}'
        ]
        tasks: ['newer:coffee:dist']
      coffeeTest:
        files: ['test/spec/{,*/}*.{coffee,litcoffee,coffee.md}']
        tasks: ['newer:coffee:test', 'karma']
      <% if (compass) { %>
      compass:
        files: ['<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}']
        tasks: ['compass:server', 'autoprefixer']
      <% } else { %>
      styles:
        files: ['<%%= yeoman.app %>/styles/{,*/}*.css']
        tasks: ['newer:copy:styles', 'autoprefixer']
      <% } %>
      gruntfile:
        files: ['Gruntfile.coffee']
      livereload:
        files: [
          '<%%= yeoman.app %>/views/{,*#*}*.{html,jade}'
          '{<%%= yeoman.tmp %>,<%%= yeoman.app %>}/styles/{,*#*}*.css'
          '{<%%= yeoman.tmp %>,<%%= yeoman.app %>}/scripts/{,*#*}*.js'
          '<%%= yeoman.app %>/images/{,*#*}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
        options:
          livereload: true
      express:
        files: [
          '<%%= yeoman.tmp %>/server.js'
          '<%%= yeoman.tmp %>/lib/**/*.{js,json}'
        ]
        tasks: ['express:dev', 'wait']
        options:
          livereload: true
          nospawn: true #Without this option specified express won't be reloaded

    # Empties folders to start fresh
    clean:
      dist:
        files: [
          dot: true
          src: [
            '<%%= yeoman.tmp %>'
            '<%%= yeoman.dist %>/*'
            '!<%%= yeoman.dist %>/.git*'
            '!<%%= yeoman.dist %>/Procfile'
          ]
        ]
      heroku:
        files: [
          dot: true
          src: [
            'heroku/*'
            '!heroku/.git*'
            '!heroku/Procfile'
          ]
        ]
      server: '<%%= yeoman.tmp %>'

    # Add vendor prefixed styles
    autoprefixer:
      options:
        browsers: ['last 1 version']
      dist:
        files: [
          expand: true
          cwd: '<%%= yeoman.tmp %>/styles/'
          src: '{,*/}*.css'
          dest: '<%%= yeoman.tmp %>/styles/'
        ]

    # Debugging with node inspector
    'node-inspector':
      custom:
        options:
          'web-host': 'localhost'

    # Use nodemon to run server in debug mode with an initial breakpoint
    nodemon:
      debug:
        script: '<%%= yeoman.tmp %>/server.js',
        options:
          nodeArgs: ['--debug-brk']
          env:
            PORT: process.env.PORT || 9000
          callback: (nodemon) ->
            nodemon.on 'log', (event) ->
              console.log event.colour

            # opens browser on initial server start
            nodemon.on 'config:update', ->
              setTimeout ->
                require('open') 'http://localhost:8080/debug?port=5858'
              , 500

    # Automatically inject Bower components into the app
    'bower-install':
      app: <% if (jade) { %>
        html: '<%%= yeoman.app %>/views/index.jade'<% } else { %>
        html: '<%%= yeoman.app %>/views/index.html'<% } %>
        ignorePath: '<%%= yeoman.app %>/'<% if (compass && bootstrap) { %>
        exclude: ['bootstrap-sass']<% } %>

    # Compiles CoffeeScript to JavaScript
    coffee:
      options:
        sourceMap: true
        sourceRoot: ''
      dist:
        files: [
          expand: true
          cwd: '<%%= yeoman.app %>/scripts'
          src: '**/*.coffee'
          dest: '<%%= yeoman.tmp %>/app/scripts'
          ext: '.js'
        ,
          expand: true
          cwd: '<%%= yeoman.lib %>'
          src: '**/*.coffee'
          dest: '<%%= yeoman.tmp %>/lib'
          ext: '.js'
        ,
          expand: true
          cwd: '.'
          src: 'server.coffee'
          dest: '<%%= yeoman.tmp %>'
          ext: '.js'
        ]
      test:
        files: [
          expand: true
          cwd: 'test/client/spec'
          src: '{,*/}*.coffee'
          dest: '<%%= yeoman.tmp %>/client/spec'
          ext: '.js'
        ]
    <% if (compass) { %>

    # Compiles Sass to CSS and generates necessary files if requested
    compass:
      options:
        sassDir: '<%%= yeoman.app %>/styles'
        cssDir: '<%%= yeoman.tmp %>/styles'
        generatedImagesDir: '<%%= yeoman.tmp %>/images/generated'
        imagesDir: '<%%= yeoman.app %>/images'
        javascriptsDir: '<%%= yeoman.app %>/scripts'
        fontsDir: '<%%= yeoman.app %>/styles/fonts'
        importPath: '<%%= yeoman.app %>/bower_components'
        httpImagesPath: '/images'
        httpGeneratedImagesPath: '/images/generated'
        httpFontsPath: '/styles/fonts'
        relativeAssets: false
        assetCacheBuster: false
        raw: 'Sass::Script::Number.precision = 10\n'
      dist:
        options:
          generatedImagesDir: '<%%= yeoman.dist %>/public/images/generated'
      server:
        options:
          debugInfo: true
    <% } %>

    # Renames files for browser caching purposes
    rev:
      dist:
        files:
          src: [
            '<%%= yeoman.dist %>/public/scripts/{,*/}*.js'
            '<%%= yeoman.dist %>/public/styles/{,*/}*.css'
            '<%%= yeoman.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            '<%%= yeoman.dist %>/public/styles/fonts/*'
          ]

    # Reads HTML for usemin blocks to enable smart builds that automatically
    # concat, minify and revision files. Creates configurations in memory so
    # additional tasks can operate on them
    useminPrepare:
      html: ['<%%= yeoman.app %>/views/index.html'
             '<%%= yeoman.app %>/views/index.jade']
      options:
        dest: '<%%= yeoman.dist %>/public'

    # Performs rewrites based on rev and the useminPrepare configuration
    usemin:
      html: ['<%%= yeoman.dist %>/views/{,*/}*.html'
             '<%%= yeoman.dist %>/views/{,*/}*.jade']
      css: ['<%%= yeoman.dist %>/public/styles/{,*/}*.css']
      options:
        assetsDirs: ['<%%= yeoman.dist %>/public']

    # The following *-min tasks produce minified files in the dist folder
    imagemin:
      options:
        cache: false
      dist:
        files: [
          expand: true
          cwd: '<%%= yeoman.app %>/images'
          src: '{,*/}*.{png,jpg,jpeg,gif}'
          dest: '<%%= yeoman.dist %>/public/images'
        ]

    svgmin:
      dist:
        files: [
          expand: true
          cwd: '<%%= yeoman.app %>/images'
          src: '{,*/}*.svg'
          dest: '<%%= yeoman.dist %>/public/images'
        ]

    htmlmin:
      dist:
        # options:
          #collapseWhitespace: true,
          #collapseBooleanAttributes: true,
          #removeCommentsFromCDATA: true,
          #removeOptionalTags: true
        files: [
          expand: true
          cwd: '<%%= yeoman.app %>/views'
          src: ['*.html', 'partials/**/*.html']
          dest: '<%%= yeoman.dist %>/views'
        ]

    # Allow the use of non-minsafe AngularJS files. Automatically makes it
    # minsafe compatible so Uglify does not destroy the ng references
    ngmin:
      dist:
        files: [
          expand: true
          cwd: '<%%= yeoman.tmp %>/concat/scripts'
          src: '*.js'
          dest: '<%%= yeoman.tmp %>/concat/scripts'
        ]

    # Replace Google CDN references
    cdnify:
      dist:
        html: ['<%%= yeoman.dist %>/views/*.html']

    # Copies remaining files to places other tasks can use
    copy:
      dist:
        files: [
          expand: true
          dot: true
          cwd: '<%%= yeoman.app %>'
          dest: '<%%= yeoman.dist %>/public'
          src: [
            '*.{ico,png,txt}'
            '.htaccess'
            'bower_components/**/*'
            'images/{,*/}*.{webp}'
            'fonts/**/*'
          ]
        ,
          expand: true
          dot: true
          cwd: '<%%= yeoman.app %>/views'
          dest: '<%%= yeoman.dist %>/views'
          src: '**/*.jade'
        ,
          expand: true
          cwd: '<%%= yeoman.tmp %>/images'
          dest: '<%%= yeoman.dist %>/public/images'
          src: ['generated/*']
        ,
          expand: true
          cwd: '<%%= yeoman.tmp %>'
          dest: '<%%= yeoman.dist %>'
          src: [
            'server.js'
            'lib/**/*'
          ]
        ,
          expand: true
          dest: '<%%= yeoman.dist %>'
          src: ['package.json']
        ]
      app:
        files: [
          expand: true
          cwd: '<%%= yeoman.app %>/bower_components'
          dest: '<%%= yeoman.tmp %>/app/bower_components/'
          src: '**/*'
        ,
          expand: true
          cwd: '<%%= yeoman.app %>/styles'
          dest: '<%%= yeoman.tmp %>/app/styles/'
          src: '{,*/}*.css'
        ,<% if (jade) { %>
          expand: true
          cwd: '<%%= yeoman.app %>/views'
          dest: '<%%= yeoman.tmp %>/app/views/'
          src: '**/*.jade'
        ,<% } else { %>
          expand: true
          cwd: '<%%= yeoman.app %>/views'
          dest: '<%%= yeoman.tmp %>/app/views/'
          src: '**/*.html'
        ,<% } %>
          expand: true
          cwd: '<%%= yeoman.app %>/fonts'
          dest: '<%%= yeoman.tmp %>/app/fonts/'
          src: '**/*'
        ,
          expand: true
          cwd: '<%%= yeoman.app %>/images'
          dest: '<%%= yeoman.tmp %>/app/images/'
          src: '**/*'
        ,
          expand: true
          cwd: '<%%= yeoman.app %>'
          dest: '<%%= yeoman.tmp %>/app/'
          src: '*'
        ]

    # Run some tasks in parallel to speed up the build process
    concurrent:
      server: [
        'coffee:dist'<% if (compass) { %>
        'compass:server'<% } else { %>
        'copy:app'<% } %>
      ]
      test: [
        'coffee'<% if (compass) { %>
        'compass'<% } else { %>
        'copy:app'<% } %>
      ]
      debug:
        tasks: [
          'nodemon'
          'node-inspector'
        ]
        options:
          logConcurrentOutput: true
      dist: [
        'coffee'<% if (compass) { %>
        'compass:dist'<% } else { %>
        'copy:app'<% } %>
        'imagemin'
        'svgmin'
        'htmlmin'
      ]

    # By default, your `index.html`'s <!-- Usemin block --> will take care of
    # minification. These next options are pre-configured if you do not wish
    # to use the Usemin blocks.
    # cssmin:
    #   dist:
    #     files:
    #       '<%%= yeoman.dist %>/styles/main.css': [
    #         '<%%= yeoman.tmp %>/styles/{,*/}*.css'
    #         '<%%= yeoman.app %>/styles/{,*/}*.css'
    #       ]
    # uglify:
    #   dist:
    #     files:
    #       '<%%= yeoman.dist %>/scripts/scripts.js': [
    #         '<%%= yeoman.dist %>/scripts/scripts.js'
    #       ]
    # concat:
    #   dist: {}

    # Test settings
    karma:
      unit:
        configFile: 'karma.conf.coffee'
        singleRun: true

    mochaTest:
      options:
        reporter: 'spec'
        require: 'coffee-script/register'
      src: ['test/server/**/*.coffee']

    env:
      test:
        NODE_ENV: 'test'

  # Used for delaying livereload until after server has restarted
  grunt.registerTask 'wait', ->
    grunt.log.ok 'Waiting for server reload...'

    done = this.async()

    setTimeout ->
      grunt.log.writeln 'Done waiting!'
      done()
    , 500

  grunt.registerTask 'express-keepalive', 'Keep grunt running', ->
    this.async()

  grunt.registerTask 'serve', (target) ->
    if target is 'dist'
      return grunt.task.run ['build', 'express:prod', 'open', 'express-keepalive']

    if target is 'debug'
      return grunt.task.run [
        'clean:server'
        'bower-install'
        'concurrent:server'
        'autoprefixer'
        'concurrent:debug'
      ]

    grunt.task.run [
      'clean:server'
      'bower-install'
      'concurrent:server'
      'autoprefixer'
      'express:dev'
      'open'
      'watch'
    ]

  grunt.registerTask 'server', ->
    grunt.log.warn 'The `server` task has been deprecated. Use `grunt serve` to start a server.'
    grunt.task.run ['serve']

  grunt.registerTask 'test', (target) ->
    if target is 'server'
      return grunt.task.run [
        'env:test'
        'mochaTest'
      ]

    else if target is 'client'
      return grunt.task.run [
        'clean:server'
        'concurrent:test'
        'autoprefixer'
        'karma'
      ]

    else grunt.task.run [
      'test:server'
      'test:client'
    ]

  grunt.registerTask 'build', [
    'clean:dist'
    'bower-install'
    'useminPrepare'
    'concurrent:dist'
    'autoprefixer'
    'concat'
    'ngmin'
    'copy:dist'
    'cdnify'
    'cssmin'
    'uglify'
    'rev'
    'usemin'
  ]

  grunt.registerTask 'heroku', ->
    grunt.log.warn 'The `heroku` task has been deprecated. Use `grunt build` to build for deployment.'
    grunt.task.run ['build']

  grunt.registerTask 'default', [
    'test'
    'build'
  ]
