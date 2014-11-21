/* jshint onevar:false */
'use strict';
var async = require('async');
var opn = require('opn');
var gen = require('yeoman-generator');
var yosay = require('yosay');
var util = require('util');
var path = require('path');
var updateNotifier = require('update-notifier');
var chalk = require('chalk');
var findup = require('findup');
var fullname = require('fullname');
var _s = require('underscore.string');
var Configstore = require('configstore');
var pkg = require('./package.json');

var conf = new Configstore(pkg.name, {
  generatorRunCount: {}
});

function namespaceToName(val) {
  return val.replace(/(\w+):\w+/, '$1');
}

// The `yo yo` generator provides users with a few common, helpful commands.
var yoyo = module.exports = function (args, options) {
  gen.Base.apply(this, arguments);
  this.insight = options.insight;

  this.insight.track('yoyo', 'init');
  process.once('exit', this._exit.bind(this));
};

util.inherits(yoyo, gen.Base);


// Runs parallel `npm install -g`s for each selected generator.
yoyo.prototype._updateGenerators = function (pkgs) {
  var self = this;

  var resolveGenerators = function (pkg) {
    return function (next) {
      self.spawnCommand('npm', ['install', '-g', pkg])
        .on('error', next)
        .on('exit', next);
    };
  };

  self.insight.track('yoyo', 'update');
  async.parallel(self._.map(pkgs, resolveGenerators), function (err) {
    if (err) {
      self.insight.track('yoyo:err', 'update');
      self.emit('error', err);
      return;
    }

    self.insight.track('yoyo', 'updated');
    self.home({
      refresh: true,
      message:
        'I\'ve just updated your generators. Remember, you can update' +
        '\na specific generator with npm by running:\n' +
        chalk.magenta('\n    npm install -g generator-_______')
    });
  });
};

// Prompts the user to select which generators to update
yoyo.prototype._promptToUpdateGenerators = function () {
  this.prompt([{
    name: '_updateSelectedGenerators',
    message: 'Generators to update',
    type: 'checkbox',
    choices: this._.map(this.pkgs, function (generator) {
      return {name: generator.name, checked: true};
    })
  }], function (answer) {
    this._updateGenerators.call(this, answer._updateSelectedGenerators);
  }.bind(this));
};

// Initializes a generator.
//
// - generator - (string) The generator to initialize.
yoyo.prototype._initGenerator = function (generator, done) {
  console.log(
    chalk.yellow('\nMake sure you are in the directory you want to scaffold into.\n') +
    chalk.dim('This generator can also be run with: ' +
    chalk.blue('yo ' + generator.split(':')[0]) + '\n')
  );

  // save the generator run count
  var generatorName = namespaceToName(generator);
  var generatorRunCount = conf.get('generatorRunCount');
  generatorRunCount[generatorName] = typeof generatorRunCount[generatorName] === 'number' ?
    ++generatorRunCount[generatorName] : 1;
  conf.set('generatorRunCount', generatorRunCount);

  this.insight.track('yoyo', 'run', generator);
  this.composeWith(generator);
  done();
};


// Serves as the response prompt for "Install a generator" as well as simply
// installs a generator if a string is passed in.
//
// - pkgName - (optional) A string that matches the NPM package name.
yoyo.prototype._installGenerator = function (pkgName) {
  if (this._.isString(pkgName)) {
    this.insight.track('yoyo', 'install', pkgName);

    // We know what generator we want to install
    return this.spawnCommand('npm', ['install', '-g', pkgName])
      .on('error', function (err) {
        this.insight.track('yoyo:err', 'install', pkgName);
        this.emit('error', err);
      }.bind(this))
      .on('exit', function () {
        this.insight.track('yoyo', 'installed', pkgName);
        this.home({
          refresh: true,
          message:
            '\nI just installed a generator by running:\n' +
            chalk.blue.bold('\n    npm install -g ' + pkgName)
        });
      }.bind(this));
  }

  this.insight.track('yoyo', 'install');

  this.prompt([{
    name: 'searchTerm',
    message: 'Search NPM for generators'
  }], this._searchNpm.bind(this));
};


// Grabs all of the packages with a `yeoman-generator` keyword on NPM.
//
// - term - (object) Contains the search term & gets passed back to callback().
// - cb   - Callback to execute once generators have been found.
yoyo.prototype._findAllNpmGenerators = function (term, cb) {
  var url = 'http://isaacs.iriscouch.com/registry/_design/' +
    'app/_view/byKeyword?startkey=[%22yeoman-generator%22]' +
    '&endkey=[%22yeoman-generator%22,{}]&group_level=3';

  this.request(url, function (err, res, body) {
    if (err) {
      this.emit('error', err);
      return;
    }

    try {
      this.npmGenerators = JSON.parse(body);
    } catch (err) {
      return this.emit('error', new Error(chalk.bold(
        'A problem occurred contacting the registry.' +
        '\nUnable to parse response: not valid JSON.'
      )));
    }

    cb(term);
  }.bind(this));
};


// Takes a search term, looks it up in the registry, prompts the user with the
// results, allowing them to choose to install it, or go back home.
//
// - term - Object with a 'searchTerm' property containing the term to search
//          NPM for.
yoyo.prototype._searchNpm = function (term) {
  if (!this.npmGenerators) {
    return this._findAllNpmGenerators(term, this._searchNpm.bind(this));
  }

  // Find any matches from NPM.
  var choices = this._.chain(this.npmGenerators.rows).map(function (generator) {
    // Make sure it's not already installed.
    if (
      !this.pkgs[generator.key[1]] &&
      generator.key.join(' ').indexOf(term.searchTerm) > -1
    ) {
      return {
        name: generator.key[1].replace(/^generator-/, ''),
        value: generator.key[1]
      };
    }
  }.bind(this)).compact().value();

  var resultsPrompt = [{
    name: '_installGenerator',
    type: 'list',
    message: choices.length > 0 ?
      'Here\'s what I found. Install one?' : 'Sorry, nothing was found',
    choices: this._.union(choices, [{
      name: 'Search again',
      value: '_installGenerator'
    }, {
      name: 'Return home',
      value: 'home'
    }])
  }];

  this.prompt(resultsPrompt, function (answer) {
    if (this._.isFunction(this[answer._installGenerator])) {
      return this[answer._installGenerator]();
    }

    this._installGenerator(answer._installGenerator);
  }.bind(this));
};


// Prompts user with a few helpful resources, then opens it in their browser.
yoyo.prototype._findHelp = function () {
  this.insight.track('yoyo', 'help');
  this.prompt([{
    name: 'whereTo',
    type: 'list',
    message:
      'Here are a few helpful resources.\n' +
      '\nI will open the link you select in your browser for you',
    choices: [{
      name: 'Take me to the documentation',
      value: 'http://yeoman.io/learning/index.html'
    }, {
      name: 'View Frequently Asked Questions',
      value: 'http://yeoman.io/learning/faq.html'
    }, {
      name: 'File an issue on GitHub',
      value: 'http://yeoman.io/contributing/opening-issues.html'
    }, {
      name: 'Take me back home, Yo!',
      value: {
        method: 'home',
        args: {
          message: 'I get it, you like learning on your own. I respect that.'
        }
      }
    }]
  }], function (answer) {
    this.insight.track('yoyo', 'help', answer);

    if (this._.isFunction(this[answer.whereTo.method])) {
      this[answer.whereTo.method](answer.whereTo.args);
    } else {
      opn(answer.whereTo);
    }
  }.bind(this));
};


// Serves as a quick escape from the `yo yo` prompts.
yoyo.prototype._exit = function () {
  this.insight.track('yoyo', 'exit');

  var url = 'https://github.com/yeoman/yeoman#team';
  var maxLength = url.length;
  var newLine = new Array(maxLength).join(' ');

  console.log(
    '\n' +
    yosay(
      'Bye from us! Chat soon.' +
      newLine +
      newLine +
      'The Yeoman Team ' + url,
      { maxLength: maxLength }
    )
  );
};


// I'm sorry...
yoyo.prototype._noop = function () {};


// Rolls through all of the generators provided by `env.generators`, finding
// their `package.json` files, then storing them internally in `this.pkgs`.
yoyo.prototype.findGenerators = function () {
  this.pkgs = {};

  var resolveGenerators = function (generator) {
    if (!/(app|all)$/.test(generator.namespace)) {
      return;
    }

    var dir = findup.sync(generator.resolved, 'package.json');
    if (!dir) {
      return;
    }

    var pkg = gen.file.readJSON(path.join(dir, 'package.json'));
    pkg.namespace = generator.namespace;
    pkg.appGenerator = true;
    pkg.prettyName = _s.titleize(_s.humanize(namespaceToName(generator.namespace)));

    pkg.update = updateNotifier({
      packageName: pkg.name,
      packageVersion: pkg.version
    }).update;

    if (pkg.update && pkg.version !== pkg.update.latest) {
      pkg.updateAvailable = true;
    }

    this.pkgs[pkg.name] = pkg;
  };

  this._.each(this.env.getGeneratorsMeta(), resolveGenerators, this);
};


// Display the home `yo` screen, with the intial set of options.
//
// - options - (optional)
//           - message (string) - String to print before prompt.
//           - refresh (bool) - Spawn a new `yo` command.
yoyo.prototype.home = function (options) {
  var done = this.async();

  options = options || {};

  if (options.refresh) {
    this.env.lookup();
    this.findGenerators();
  }

  if (options.message) {
    console.log('\n' + chalk.cyan(options.message) + '\n');
  }

  var defaultChoices = [{
    name: 'Install a generator',
    value: {
      method: '_installGenerator'
    }
  }, {
    name: 'Find some help',
    value: {
      method: '_findHelp'
    }
  }, {
    name: 'Get me out of here!',
    value: {
      method: '_noop'
    }
  }];

  var generatorList = this._.chain(this.pkgs).map(function (generator) {
    if (!generator.appGenerator) {
      return;
    }

    var updateInfo = generator.updateAvailable ? chalk.dim.yellow(' ♥ Update Available!') : '';

    // TODO
    // var updateInfo = generator.updateAvailable ?
    //   chalk.dim.yellow(' ♥ Update Available!') +
    //   chalk.dim.reset(' (Press Space to update)') : '';

    return {
      name: generator.prettyName + updateInfo,
      value: {
        method: '_initGenerator',
        args: generator.namespace
      }
    };
  }).compact().sortBy(function (el) {
    var generatorName = namespaceToName(el.value.args);
    return -conf.get('generatorRunCount')[generatorName] || 0;
  }).value();

  if (generatorList.length) {
    defaultChoices.unshift({
      name: 'Update your generators',
      value: {
        method: '_promptToUpdateGenerators'
      }
    });
  }

  this.insight.track('yoyo', 'home');

  fullname(function (err, name) {
    if (err) {
      done(err);
      return;
    }

    var allo = name ? ('\'Allo ' + name.split(' ')[0] + '! ') : '\'Allo! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: this._.flatten([
        new gen.inquirer.Separator('Run a generator'),
        generatorList,
        new gen.inquirer.Separator(),
        defaultChoices,
        new gen.inquirer.Separator()
      ])
    }], function (answer) {
      this[answer.whatNext.method](answer.whatNext.args, done);
    }.bind(this));
  }.bind(this));
};
