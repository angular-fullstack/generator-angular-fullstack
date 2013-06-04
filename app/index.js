'use strict';
var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.indexFile = this.engine(this.read('../../templates/common/index.html'),
      this);

  args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe');
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

  this.hookFor('karma', {
    as: 'app',
    options: {
      options: {
        coffee: this.options.coffee,
        'skip-install': this.options['skip-install']
       }
    }
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForBootstrap = function askForBootstrap() {
  var cb = this.async();

  this.prompt({
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: true,
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bootstrap = props.bootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForCompass = function askForCompass() {
  if (!this.bootstrap) {
    return;
  }

  var cb = this.async();

  this.prompt({
    name: 'compassBootstrap',
    message: 'If so, would you like to use Twitter Bootstrap for Compass (as opposed to vanilla CSS)?',
    default: true,
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.compassBootstrap = props.compassBootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [{
    name: 'resourceModule',
    message: 'Would you like to include angular-resource.js?',
    default: true,
    warning: 'Yes: angular-resource added to bower.json'
  }, {
    name: 'cookiesModule',
    message: 'Would you like to include angular-cookies.js?',
    default: true,
    warning: 'Yes: angular-cookies added to bower.json'
  }, {
    name: 'sanitizeModule',
    message: 'Would you like to include angular-sanitize.js?',
    default: true,
    warning: 'Yes: angular-sanitize added to bower.json'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.resourceModule = props.resourceModule;
    this.cookiesModule = props.cookiesModule;
    this.sanitizeModule = props.sanitizeModule;

    cb();
  }.bind(this));
};

// Waiting a more flexible solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  if (this.compassBootstrap) {
    this.copy('styles/bootstrap.scss', path.join(this.appPath, 'styles/style.scss'));
    this.indexFile = this.appendStyles(this.indexFile, 'styles/main.css', ['styles/style.css']);
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap');
    var cssFiles = ['styles/bootstrap.css', 'styles/main.css'];

    cssFiles.forEach(function (css) {
      this.copy(css, path.join(this.appPath, css));
    }.bind(this));
    this.indexFile = this.appendStyles(this.indexFile, 'styles/main.css', cssFiles);
  }
};

Generator.prototype.bootstrapJS = function bootstrapJS() {
  if (!this.bootstrap) {
    return;  // Skip if disabled.
  }

  // Wire Twitter Bootstrap plugins
  this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
    'components/jquery/jquery.js',
    'components/bootstrap-sass/js/bootstrap-affix.js',
    'components/bootstrap-sass/js/bootstrap-alert.js',
    'components/bootstrap-sass/js/bootstrap-dropdown.js',
    'components/bootstrap-sass/js/bootstrap-tooltip.js',
    'components/bootstrap-sass/js/bootstrap-modal.js',
    'components/bootstrap-sass/js/bootstrap-transition.js',
    'components/bootstrap-sass/js/bootstrap-button.js',
    'components/bootstrap-sass/js/bootstrap-popover.js',
    'components/bootstrap-sass/js/bootstrap-typeahead.js',
    'components/bootstrap-sass/js/bootstrap-carousel.js',
    'components/bootstrap-sass/js/bootstrap-scrollspy.js',
    'components/bootstrap-sass/js/bootstrap-collapse.js',
    'components/bootstrap-sass/js/bootstrap-tab.js'
  ]);
};

Generator.prototype.extraModules = function extraModules() {
  var modules = [];
  if (this.resourceModule) {
    modules.push('components/angular-resource/angular-resource.js');
  }

  if (this.cookiesModule) {
    modules.push('components/angular-cookies/angular-cookies.js');
  }

  if (this.sanitizeModule) {
    modules.push('components/angular-sanitize/angular-sanitize.js');
  }

  if (modules.length) {
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/modules.js',
        modules);
  }

};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function () {
  this.template('../../templates/common/bower.json', 'bower.json');
  this.template('../../templates/common/package.json', 'package.json');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};
