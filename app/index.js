'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');


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

  if (typeof this.env.options.jade === 'undefined') {
    this.option('jade', {
      desc: 'Generate views using Jade templates'
    });

    // attempt to detect if user is using jade or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/views/**/*.jade'), {}).length > 0) {
      this.options.jade = true;
    }

    this.env.options.jade = this.options.jade;
  }

  this.hookFor('angular-fullstack:common', {
    args: args
  });

  this.hookFor('angular-fullstack:main', {
    args: args
  });

  this.hookFor('angular-fullstack:controller', {
    args: args
  });

  this.on('end', function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: this._injectDependencies.bind(this)
    });

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

    if (this.routeModule) {
      enabledComponents.push('angular-route/angular-route.js');
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

  this.pkg = require('../package.json');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(
      'Out of the box I include Bootstrap and some AngularJS recommended modules.\n'
    );

    // Deprecation notice for minsafe
    if (this.options.minsafe) {
      console.warn(
        '\n** The --minsafe flag is being deprecated in 0.7.0 and removed in ' +
        '0.8.0. For more information, see ' +
        'https://github.com/yeoman/generator-angular#minification-safe. **\n'
      );
    }
  }
};

Generator.prototype.askForCompass = function askForCompass() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'compass',
    message: 'Would you like to use Sass (with Compass)?',
    default: true
  }], function (props) {
    this.compass = props.compass;

    cb();
  }.bind(this));
};

Generator.prototype.askForBootstrap = function askForBootstrap() {
  var compass = this.compass;
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: true
  }, {
    type: 'confirm',
    name: 'compassBootstrap',
    message: 'Would you like to use the Sass version of Twitter Bootstrap?',
    default: true,
    when: function (props) {
      return props.bootstrap && compass;
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
    }, {
      value: 'routeModule',
      name: 'angular-route.js',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');
    this.routeModule = hasMod('routeModule');

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
    if (this.routeModule) {
      angMods.push("'ngRoute'");
      this.env.options.ngRoute = true;
    }

    if (angMods.length) {
      this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") +"\n";
    }

    cb();
  }.bind(this));
};

Generator.prototype.askForMongo = function askForMongo() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'mongo',
    message: 'Would you like to include MongoDB with Mongoose?',
    default: false
  }], function (props) {
    this.mongo = props.mongo;

    cb();
  }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
  this.ngRoute = this.env.options.ngRoute;
  this.jade = this.env.options.jade;

  if(this.jade) {
    this.indexFile = this.engine(this.read('../../templates/views/jade/index.jade'), this);
  } else {
    this.indexFile = this.engine(this.read('../../templates/views/html/index.html'), this);
  }
};

Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  var sass = this.compass;
  var mainFile = 'main.' + (sass ? 's' : '') + 'css';

  if (this.bootstrap && !sass) {
    this.copy('fonts/glyphicons-halflings-regular.eot', 'app/fonts/glyphicons-halflings-regular.eot');
    this.copy('fonts/glyphicons-halflings-regular.ttf', 'app/fonts/glyphicons-halflings-regular.ttf');
    this.copy('fonts/glyphicons-halflings-regular.svg', 'app/fonts/glyphicons-halflings-regular.svg');
    this.copy('fonts/glyphicons-halflings-regular.woff', 'app/fonts/glyphicons-halflings-regular.woff');
  }

  this.copy('styles/' + mainFile, 'app/styles/' + mainFile);
  var appendOptions = {
    html: this.indexFile,
    fileType: 'css',
    optimizedPath: 'styles/main.css',
    sourceFileList: files.map(function (file) {
      return 'styles/' + file.replace('.scss', '.css');
    }),
    searchPath: ['.tmp', 'app']
  };

  if (this.jade) {
    this.indexFile = appendFilesToJade(appendOptions);
  } else {
    this.indexFile = this.appendFiles(appendOptions);
  }
};

function generateJadeBlock(blockType, optimizedPath, filesBlock, searchPath, prefix) {
  var blockStart, blockEnd;
  var blockSearchPath = '';

  if (searchPath !== undefined) {
    if (util.isArray(searchPath)) {
      searchPath = '{' + searchPath.join(',') + '}';
    }
    blockSearchPath = '(' + searchPath +  ')';
  }

  blockStart = '\n' + prefix + '<!-- build:' + blockType + blockSearchPath + ' ' + optimizedPath + ' -->\n';
  blockEnd = prefix + '<!-- endbuild -->\n' + prefix;
  return blockStart + filesBlock + blockEnd;
}

function appendJade(jade, tag, blocks){
  var mark = "//- build:" + tag,
      position = jade.indexOf(mark);
  return [jade.slice(0, position), blocks, jade.slice(position)].join('');
}

function appendFilesToJade(jadeOrOptions, fileType, optimizedPath, sourceFileList, attrs, searchPath) {
  var blocks, updatedContent,
      jade = jadeOrOptions,
      prefix = '    ',
      files = '';

  if (typeof jadeOrOptions === 'object') {
    jade = jadeOrOptions.html;
    fileType = jadeOrOptions.fileType;
    optimizedPath = jadeOrOptions.optimizedPath;
    sourceFileList = jadeOrOptions.sourceFileList;
    attrs = jadeOrOptions.attrs;
    searchPath = jadeOrOptions.searchPath;
  }

  if (fileType === 'js') {
    sourceFileList.forEach(function (el) {
      files += prefix + '<script ' + (attrs||'') + 'src="' + el + '"></script>\n';
    });
    blocks = generateJadeBlock('js', optimizedPath, files, searchPath, prefix);
    updatedContent = appendJade(jade, 'body', blocks);
  } else if (fileType === 'css') {
    sourceFileList.forEach(function (el) {
      files += prefix + '<link ' + (attrs||'') + 'rel="stylesheet" href="' + el  + '">\n';
    });
    blocks = generateJadeBlock('css', optimizedPath, files, searchPath, prefix);
    updatedContent = appendJade(jade, 'head', blocks);
  }
  return updatedContent;
}

Generator.prototype.navBarScript = function navBarScript() {
  var ext = 'js';
  var folder = 'javascript';
  var minsafe = '';

  if(this.env.options.coffee) {
    ext = 'coffee';
    folder = 'coffeescript';
  }

  if(this.env.options.minsafe) {
    minsafe = '-min';
  }

  this.copy('../../templates/' + folder + minsafe + '/navbar.' + ext, 'app/scripts/controllers/navbar.' + ext);
};

Generator.prototype.appJs = function appJs() {
  var appendOptions = {
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/scripts.js',
    sourceFileList: ['scripts/app.js', 'scripts/controllers/main.js', 'scripts/controllers/navbar.js'],
    searchPath: ['.tmp', 'app']
  };
  if (this.jade) {
    this.indexFile = appendFilesToJade(appendOptions);
  } else {
    this.indexFile = this.appendFiles(appendOptions);
  }
};

Generator.prototype.createIndex = function createIndex() {
  if (this.jade) {
    this.write(path.join(this.appPath, 'views', 'index.jade'), this.indexFile);
  } else {
    this.write(path.join(this.appPath, 'views', 'index.html'), this.indexFile);
  }
};

Generator.prototype.addJadeViews = function addHtmlJade() {
  if(this.jade) {
    this.copy('../../templates/views/jade/partials/main.jade', 'app/views/partials/main.jade');
    this.copy('../../templates/views/jade/partials/navbar.jade', 'app/views/partials/navbar.jade');
    this.copy('../../templates/views/jade/404.jade', 'app/views/404.jade');
  }
};

Generator.prototype.addHtmlViews = function addHtmlViews() {
  if(!this.jade) {
    this.copy('../../templates/views/html/partials/main.html', 'app/views/partials/main.html');
    this.copy('../../templates/views/html/partials/navbar.html', 'app/views/partials/navbar.html');
    this.copy('../../templates/views/html/404.html', 'app/views/404.html');
  }
};

Generator.prototype.packageFiles = function () {
  this.coffee = this.env.options.coffee;
  this.template('../../templates/common/_bower.json', 'bower.json');
  this.template('../../templates/common/_package.json', 'package.json');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};

Generator.prototype.imageFiles = function () {
  this.sourceRoot(path.join(__dirname, 'templates'));
  this.directory('images', 'app/images', true);
};

Generator.prototype._injectDependencies = function _injectDependencies() {
  var howToInstall =
    '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
    '\nyour HTML by running:' +
    '\n' +
    chalk.yellow.bold('\n  grunt bower-install');

  if (this.options['skip-install']) {
    console.log(howToInstall);
  } else {
    wiredep({
      directory: 'app/bower_components',
      bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
      ignorePath: 'app/',
      htmlFile: 'app/index.html',
      cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
    });
  }
};
};

Generator.prototype.serverFiles = function () {
  this.template('../../templates/express/server.js', 'server.js');
  this.template('../../templates/express/api.js', 'lib/controllers/api.js');
  this.template('../../templates/express/index.js', 'lib/controllers/index.js');
};

Generator.prototype.mongoFiles = function () {
  if (!this.mongo) {
    return;  // Skip if disabled.
  }

  this.template('../../templates/express/mongo/mongo.js', 'lib/db/mongo.js');
  this.template('../../templates/express/mongo/dummydata.js', 'lib/db/dummydata.js');
  this.template('../../templates/express/mongo/thing.js', 'lib/models/thing.js');
};
