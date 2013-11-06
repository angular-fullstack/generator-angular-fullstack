'use strict';
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.option('app-suffix', {
    desc: 'Allow a custom suffix to be added to the module name',
    type: String,
    required: 'false'
  });
  this.scriptAppName = this.appname + angularUtils.appName(this);

  args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee', {
      desc: 'Generate CoffeeScript instead of JavaScript'
    });

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe', {
      desc: 'Generate AngularJS minification safe code'
    });
    this.env.options.minsafe = this.options.minsafe;
    args.push('--minsafe');
  }

  this.hookFor('angular:common', {
    args: args
  });

  this.hookFor('angular:main', {
    args: args
  });

  this.hookFor('angular:controller', {
    args: args
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });

    var enabledComponents = [];

    if (this.resourceModule) {
      enabledComponents.push('angular-resource/angular-resource.js');
    }

    if (this.cookiesModule) {
      enabledComponents.push('angular-cookies/angular-cookies.js');
    }

    if (this.sanitizeModule) {
      enabledComponents.push('angular-sanitize/angular-sanitize.js');
    }

    this.invoke('karma:app', {
      options: {
        coffee: this.options.coffee,
        travis: true,
        'skip-install': this.options['skip-install'],
        components: [
          'angular/angular.js',
          'angular-mocks/angular-mocks.js'
        ].concat(enabledComponents)
      }
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForBootstrap = function askForBootstrap() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: true
  }, {
    type: 'confirm',
    name: 'compassBootstrap',
    message: 'Would you like to use the SCSS version of Twitter Bootstrap with the Compass CSS Authoring Framework?',
    default: true,
    when: function (props) {
      return props.bootstrap;
    }
  }], function (props) {
    this.bootstrap = props.bootstrap;
    this.compassBootstrap = props.compassBootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'modules',
    message: 'Which modules would you like to include?',
    choices: [{
      value: 'resourceModule',
      name: 'angular-resource.js',
      checked: true
    }, {
      value: 'cookiesModule',
      name: 'angular-cookies.js',
      checked: true
    }, {
      value: 'sanitizeModule',
      name: 'angular-sanitize.js',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');

    var angMods = [];

    if (this.cookiesModule) {
      angMods.push("'ngCookies'");
    }

    if (this.resourceModule) {
      angMods.push("'ngResource'");
    }
    if (this.sanitizeModule) {
      angMods.push("'ngSanitize'");
    }

    if (angMods.length) {
      this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") +"\n";
    }

    cb();
  }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
  this.indexFile = this.engine(this.read('../../templates/common/index.html'), this);
};

// Waiting a more flexible solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  var sass = this.compassBootstrap;
  var files = [];
  var source = 'styles/' + ( sass ? 's' : '' ) + 'css/';

  if (this.bootstrap && !sass) {
    files.push('bootstrap.css');
    this.copy('fonts/glyphicons-halflings-regular.eot', 'app/fonts/glyphicons-halflings-regular.eot');
    this.copy('fonts/glyphicons-halflings-regular.ttf', 'app/fonts/glyphicons-halflings-regular.ttf');
    this.copy('fonts/glyphicons-halflings-regular.svg', 'app/fonts/glyphicons-halflings-regular.svg');
    this.copy('fonts/glyphicons-halflings-regular.woff', 'app/fonts/glyphicons-halflings-regular.woff');
  }

  files.push('main.' + (sass ? 's' : '') + 'css');

  files.forEach(function (file) {
    this.copy(source + file, 'app/styles/' + file);
  }.bind(this));

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'css',
    optimizedPath: 'styles/main.css',
    sourceFileList: files.map(function (file) {
      return 'styles/' + file.replace('.scss', '.css');
    }),
    searchPath: '.tmp'
  });
};

Generator.prototype.bootstrapJS = function bootstrapJS() {
  if (!this.bootstrap) {
    return;  // Skip if disabled.
  }

  // Wire Twitter Bootstrap plugins
  this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
    'bower_components/sass-bootstrap/js/affix.js',
    'bower_components/sass-bootstrap/js/alert.js',
    'bower_components/sass-bootstrap/js/button.js',
    'bower_components/sass-bootstrap/js/carousel.js',
    'bower_components/sass-bootstrap/js/collapse.js',
    'bower_components/sass-bootstrap/js/dropdown.js',
    'bower_components/sass-bootstrap/js/modal.js',
    'bower_components/sass-bootstrap/js/popover.js',
    'bower_components/sass-bootstrap/js/scrollspy.js',
    'bower_components/sass-bootstrap/js/tab.js',
    'bower_components/sass-bootstrap/js/tooltip.js',
    'bower_components/sass-bootstrap/js/transition.js',
  ]);
};

Generator.prototype.extraModules = function extraModules() {
  var modules = [];
  if (this.resourceModule) {
    modules.push('bower_components/angular-resource/angular-resource.js');
  }

  if (this.cookiesModule) {
    modules.push('bower_components/angular-cookies/angular-cookies.js');
  }

  if (this.sanitizeModule) {
    modules.push('bower_components/angular-sanitize/angular-sanitize.js');
  }

  if (modules.length) {
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/modules.js',
        modules);
  }
};

Generator.prototype.appJs = function appJs() {
  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/scripts.js',
    sourceFileList: ['scripts/app.js', 'scripts/controllers/main.js'],
    searchPath: ['.tmp', 'app']
  });
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function () {
  this.template('../../templates/common/_bower.json', 'bower.json');
  this.template('../../templates/common/_package.json', 'package.json');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};
