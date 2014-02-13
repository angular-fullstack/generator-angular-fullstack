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
        testPath: 'test/client',
        travis: true,
        'skip-install': true,
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
  }, {
    type: 'confirm',
    name: 'mongoPassportUser',
    message: 'Would you like to include a Passport authentication boilerplate?',
    default: false,
    when: function (props) {
      return props.mongo;
    }
  }], function (props) {
    this.mongo = props.mongo;
    this.mongoPassportUser = props.mongoPassportUser;

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

var copyScriptWithEnvOptions = function copyScriptWithEnvOptions(that, fileToCopy, destinationFolder) {
  var ext = 'js',
    minsafe = '',
    sourceFolder = 'javascript';

  if(that.env.options.coffee) {
    ext = 'coffee';
    sourceFolder = 'coffeescript';
  }

  if(that.env.options.minsafe) {
    minsafe = '-min';
  }
  that.copy('../../templates/' + sourceFolder + minsafe + '/' + fileToCopy + '.' + ext, destinationFolder + fileToCopy + '.' + ext);
};

Generator.prototype.navBarScript = function navBarScript() {
  copyScriptWithEnvOptions(this, 'controllers/navbar', 'app/scripts/');
};

Generator.prototype.appJs = function appJs() {
  var appendOptions = {
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/scripts.js',
    sourceFileList: ['scripts/app.js', 'scripts/controllers/main.js', 'scripts/controllers/navbar.js'],
    searchPath: ['.tmp', 'app']
  };

  // only reference authentication controllers when required
  if (this.mongoPassportUser) {
    appendOptions.sourceFileList.push('scripts/controllers/login.js');
    appendOptions.sourceFileList.push('scripts/controllers/signup.js');
    appendOptions.sourceFileList.push('scripts/controllers/settings.js');
    appendOptions.sourceFileList.push('scripts/services/auth.js');
    appendOptions.sourceFileList.push('scripts/services/session.js');
    appendOptions.sourceFileList.push('scripts/services/user.js');
    appendOptions.sourceFileList.push('scripts/directives/mongooseError.js');
  }

  if (this.jade) {
    this.indexFile = appendFilesToJade(appendOptions);
  } else {
    this.indexFile = this.appendFiles(appendOptions);
  }
};

Generator.prototype.createIndex = function createIndex() {
  this.indexFile = this.indexFile.replace(/&apos;/g, "'");
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
    if(this.mongoPassportUser) {
      this.copy('../../templates/views/jade/partials/login.jade', 'app/views/partials/login.jade');
      this.copy('../../templates/views/jade/partials/signup.jade', 'app/views/partials/signup.jade');
      this.copy('../../templates/views/jade/partials/settings.jade', 'app/views/partials/settings.jade');
    }
    this.copy('../../templates/views/jade/404.jade', 'app/views/404.jade');
  }
};

Generator.prototype.addHtmlViews = function addHtmlViews() {
  if(!this.jade) {
    this.copy('../../templates/views/html/partials/main.html', 'app/views/partials/main.html');
    this.copy('../../templates/views/html/partials/navbar.html', 'app/views/partials/navbar.html');
    if(this.mongoPassportUser) {
      this.copy('../../templates/views/html/partials/login.html', 'app/views/partials/login.html');
      this.copy('../../templates/views/html/partials/signup.html', 'app/views/partials/signup.html');
      this.copy('../../templates/views/html/partials/settings.html', 'app/views/partials/settings.html');
    }
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

  var wireDepConfig = {
    directory: 'app/bower_components',
    bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
    ignorePath: 'app/',
    htmlFile: 'app/views/index.html',
    cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
  };

  if (this.jade) {
    wireDepConfig.htmlFile = 'app/views/index.jade';
  }

  if (this.compass && this.bootstrap) {
    wireDepConfig.exclude = ['sass-bootstrap'];
  }

  if (this.options['skip-install']) {
    console.log(howToInstall);
  } else {
    wiredep(wireDepConfig);
  }
};

Generator.prototype.serverFiles = function () {
  this.template('../../templates/express/server.js', 'server.js');
  this.copy('../../templates/express/jshintrc', 'lib/.jshintrc');
  this.template('../../templates/express/controllers/api.js', 'lib/controllers/api.js');
  this.template('../../templates/express/test/api/api.js', 'test/server/api/api.js');
  this.template('../../templates/express/controllers/index.js', 'lib/controllers/index.js');
  this.template('../../templates/express/routes.js', 'lib/routes.js');

  this.template('../../templates/express/config/express.js', 'lib/config/express.js');
  this.template('../../templates/express/config/config.js', 'lib/config/config.js');
  this.template('../../templates/express/config/env/all.js', 'lib/config/env/all.js');
  this.template('../../templates/express/config/env/development.js', 'lib/config/env/development.js');
  this.template('../../templates/express/config/env/production.js', 'lib/config/env/production.js');
  this.template('../../templates/express/config/env/test.js', 'lib/config/env/test.js');
};

Generator.prototype.mongoFiles = function () {

  if (!this.mongo) {
    return;  // Skip if disabled.
  }
  this.env.options.mongo = this.mongo;

  this.template('../../templates/express/config/dummydata.js', 'lib/config/dummydata.js');
  this.template('../../templates/express/models/thing.js', 'lib/models/thing.js');

  if(!this.mongoPassportUser) {
    return;  // Skip if disabled.
  }
  this.env.options.mongoPassportUser = this.mongoPassportUser;

  // frontend
  copyScriptWithEnvOptions(this, 'controllers/login',        'app/scripts/');
  copyScriptWithEnvOptions(this, 'controllers/signup',       'app/scripts/');
  copyScriptWithEnvOptions(this, 'controllers/settings',     'app/scripts/');

  copyScriptWithEnvOptions(this, 'services/auth',            'app/scripts/');
  copyScriptWithEnvOptions(this, 'services/session',         'app/scripts/');
  copyScriptWithEnvOptions(this, 'services/user',            'app/scripts/');

  copyScriptWithEnvOptions(this, 'directives/mongooseError', 'app/scripts/');

  // middleware
  this.template('../../templates/express/middleware.js', 'lib/middleware.js');
  // config
  this.template('../../templates/express/config/passport.js', 'lib/config/passport.js');
  // models
  this.template('../../templates/express/models/user.js', 'lib/models/user.js');
  // controllers
  this.template('../../templates/express/controllers/session.js', 'lib/controllers/session.js');
  this.template('../../templates/express/controllers/users.js', 'lib/controllers/users.js');
};
