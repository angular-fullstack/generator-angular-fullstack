'use strict';
var util = require('util');
var path = require('path');
var events = require('events');
var chalk = require('chalk');
var _ = require('lodash');
var GroupedQueue = require('grouped-queue');

var debug = require('debug')('generators:environment');

var Store = require('./store');
var resolver = require('./resolver');
var TerminalAdapter = require('./adapter');

/**
 * `Environment` object is responsible of handling the lifecyle and bootstrap
 * of generators in a specific environment (your app).
 *
 * It provides a high-level API to create and run generators, as well as further
 * tuning where and how a generator is resolved.
 *
 * An environment is created using a list of `arguments` and a Hash of
 * `options`. Usually, this is the list of arguments you get back from your CLI
 * options parser.
 *
 * An optional adapter can be passed to provide interaction in non-CLI environment
 * (e.g. IDE plugins), otherwise a `TerminalAdapter` is instantiated by default
 *
 * @constructor
 * @mixes env/resolver
 * @param {String|Array} args
 * @param {Object} opts
 * @param {TerminalAdapter} [adaper] - A TerminalAdapter instance or another object
 *                                     implementing this adapter interface. This is how
 *                                     you'd interface Yeoman with a GUI or an editor.
 */

var Environment = module.exports = function Environment(args, opts, adapter) {
  events.EventEmitter.call(this);

  args = args || [];
  this.arguments = Array.isArray(args) ? args : args.split(' ');
  this.options = opts || {};
  this.adapter = adapter || new TerminalAdapter();
  this.cwd = this.options.cwd || process.cwd();
  this.store = new Store();

  this.runLoop = new GroupedQueue(Environment.queues);

  this.lookups = ['.', 'generators', 'lib/generators'];
  this.aliases = [];

  this.alias(/^([^:]+)$/, '$1:app');
};

util.inherits(Environment, events.EventEmitter);
_.extend(Environment.prototype, resolver);

Environment.queues = ['initializing', 'prompting', 'configuring', 'default', 'writing', 'conflicts', 'install', 'end'];

/**
 * Error handler taking `err` instance of Error.
 *
 * The `error` event is emitted with the error object, if no `error` listener
 * is registered, then we throw the error.
 *
 * @param  {Object} err
 * @return {Error}  err
 */

Environment.prototype.error = function error(err) {
  err = err instanceof Error ? err : new Error(err);
  if (!this.emit('error', err)) {
    throw err;
  }

  return err;
};

/**
 * Outputs the general help and usage. Optionally, if generators have been
 * registered, the list of available generators is also displayed.
 *
 * @param {String} name
 */

Environment.prototype.help = function help(name) {
  name = name || 'init';

  var out = [
    'Usage: :binary: GENERATOR [args] [options]',
    '',
    'General options:',
    '  -h, --help     # Print generator\'s options and usage',
    '  -f, --force    # Overwrite files that already exist',
    '',
    'Please choose a generator below.',
    ''
  ];

  var ns = this.namespaces();

  var groups = {};
  ns.forEach(function (namespace) {
    var base = namespace.split(':')[0];

    if (!groups[base]) {
      groups[base] = [];
    }

    groups[base].push(namespace);
  });

  Object.keys(groups).sort().forEach(function (key) {
    var group = groups[key];

    if (group.length >= 1) {
      out.push('', key.charAt(0).toUpperCase() + key.slice(1));
    }

    groups[key].forEach(function (ns) {
      out.push('  ' + ns);
    });
  });

  return out.join('\n').replace(/:binary:/g, name);
};

/**
 * Registers a specific `generator` to this environment. This generator is stored under
 * provided namespace, or a default namespace format if none if available.
 *
 * @param  {String} name      - Filepath to the a generator or a NPM module name
 * @param  {String} namespace - Namespace under which register the generator (optional)
 * @return {this}
 */

Environment.prototype.register = function register(name, namespace) {
  if (!_.isString(name)) {
    return this.error(new Error('You must provide a generator name to register.'));
  }

  var modulePath = this.resolveModulePath(name);
  namespace = namespace || this.namespace(modulePath);

  if (!namespace) {
    return this.error(new Error('Unable to determine namespace.'));
  }

  this.store.add(namespace, modulePath);

  debug('Registered %s (%s)', namespace, modulePath);
  return this;
};

/**
 * Register a stubbed generator to this environment. This method allow to register raw
 * functions under the provided namespace. `registerStub` will enforce the function passed
 * to extend the Base generator automatically.
 *
 * @param  {Function} Generator - A Generator constructor or a simple function
 * @param  {String}   namespace - Namespace under which register the generator
 * @return {this}
 */

Environment.prototype.registerStub = function registerStub(Generator, namespace) {
  if (!_.isFunction(Generator)) {
    return this.error(new Error('You must provide a stub function to register.'));
  }
  if (!_.isString(namespace)) {
    return this.error(new Error('You must provide a namespace to register.'));
  }

  this.store.add(namespace, Generator);

  return this;
};

/**
 * Returns the list of registered namespace.
 * @return {Array}
 */

Environment.prototype.namespaces = function namespaces() {
  return this.store.namespaces();
};

/**
 * Returns stored generators meta
 * @return {Object}
 */

Environment.prototype.getGeneratorsMeta = function getGeneratorsMeta() {
  return this.store.getGeneratorsMeta();
};

/**
 * Get a single generator from the registered list of generators. The lookup is
 * based on generator's namespace, "walking up" the namespaces until a matching
 * is found. Eg. if an `angular:common` namespace is registered, and we try to
 * get `angular:common:all` then we get `angular:common` as a fallback (unless
 * an `angular:common:all` generator is registered).
 *
 * @param  {String} namespace
 * @return {Generator} - the generator registered under the namespace
 */

Environment.prototype.get = function get(namespace) {
  // Stop the recursive search if nothing is left
  if (!namespace) return;

  return this.store.get(namespace) ||
    this.store.get(this.alias(namespace)) ||
    this.get(namespace.split(':').slice(0, -1).join(':'));
};

/**
 * Create is the Generator factory. It takes a namespace to lookup and optional
 * hash of options, that lets you define `arguments` and `options` to
 * instantiate the generator with.
 *
 * An error is raised on invalid namespace.
 *
 * @param {String} namespace
 * @param {Object} options
 */

Environment.prototype.create = function create(namespace, options) {
  options = options || {};

  var Generator = this.get(namespace);

  if (!Generator) {
    return this.error(
      new Error(
        'You don\'t seem to have a generator with the name ' + namespace + ' installed.\n' +
        chalk.bold('You can see available generators with ' + 'npm search yeoman-generator') +
        chalk.bold(' and then install them with ' + 'npm install [name]') + '.\n' +
        'To see the ' + this.namespaces().length + ' registered generators run yo with the `--help` option.'
      )
    );
  }

  return this.instantiate(Generator, options);
};

/**
 * Instantiate a Generator with metadatas
 *
 * @param {String}       namespace
 * @param {Object}       options
 * @param {Array|String} options.arguments  Arguments to pass the instance
 * @param {Object}       options.options    Options to pass the instance
 */

Environment.prototype.instantiate = function instantiate(Generator, options) {
  options = options || {};

  var args = options.arguments || options.args || _.clone(this.arguments);
  args = Array.isArray(args) ? args : args.split(' ');

  var opts = options.options || _.clone(this.options);

  opts.env = this;
  opts.resolved = Generator.resolved || 'unknown';
  opts.namespace = Generator.namespace;
  return new Generator(args, opts);
};

/**
 * Tries to locate and run a specific generator. The lookup is done depending
 * on the provided arguments, options and the list of registered generators.
 *
 * When the environment was unable to resolve a generator, an error is raised.
 *
 * @param {String|Array} args
 * @param {Object}       options
 * @param {Function}     done
 */

Environment.prototype.run = function run(args, options, done) {
  args = args || this.arguments;

  if (typeof options === 'function') {
    done = options;
    options = this.options;
  }

  if (typeof args === 'function') {
    done = args;
    options = this.options;
    args = this.arguments;
  }

  args = Array.isArray(args) ? args : args.split(' ');
  options = options || this.options;

  var name = args.shift();
  if (!name) {
    return this.error(new Error('Must provide at least one argument, the generator namespace to invoke.'));
  }

  var generator = this.create(name, {
    args: args,
    options: options
  });

  if (generator instanceof Error) {
    return generator;
  }

  if (options.help) {
    return console.log(generator.help());
  }

  generator.on('start', this.emit.bind(this, 'generators:start'));
  generator.on('start', this.emit.bind(this, name + ':start'));

  generator.on('method', function (method) {
    this.emit(name + ':' + method);
  }.bind(this));

  generator.on('end', this.emit.bind(this, name + ':end'));
  generator.on('end', this.emit.bind(this, 'generators:end'));

  return generator.run(done);
};

/**
 * Given a String `filepath`, tries to figure out the relative namespace.
 *
 * ### Examples:
 *
 *     this.namespace('backbone/all/index.js');
 *     // => backbone:all
 *
 *     this.namespace('generator-backbone/model');
 *     // => backbone:model
 *
 *     this.namespace('backbone.js');
 *     // => backbone
 *
 *     this.namespace('generator-mocha/backbone/model/index.js');
 *     // => mocha:backbone:model
 *
 * @param {String} filepath
 */

Environment.prototype.namespace = function namespace(filepath) {
  if (!filepath) {
    throw new Error('Missing namespace');
  }

  // cleanup extension and normalize path for differents OS
  var ns = path.normalize(filepath.replace(path.extname(filepath), ''));

  // Sort lookups by length so biggest are removed first
  var lookups = _(this.lookups).map(path.normalize).sortBy('length').value().reverse();

  // if `ns` contain a lookup dir in it's path, remove it.
  ns = lookups.reduce(function (ns, lookup) {
    return ns.replace(lookup, '');
  }, ns);

  // cleanup `ns` from unwanted parts and then normalize slashes to `:`
  ns = ns
    .replace(/(.*generator-)/, '') // remove before `generator-`
    .replace(/[\/\\](index|main)$/, '') // remove `/index` or `/main`
    .replace(/\.+/g, '') // remove `.`
    .replace(/^[\/\\]+/, '') // remove leading `/`
    .replace(/[\/\\]+/g, ':'); // replace slashes by `:`

  debug('Resolve namespaces for %s: %s', filepath, ns);

  return ns;
};

/**
 * Resolve a module path
 * @param  {String} moduleId - Filepath or module name
 * @return {String}          - The resolved path leading to the module
 */

Environment.prototype.resolveModulePath = function resolveModulePath(moduleId) {
  if (moduleId[0] === '.') {
    moduleId = path.resolve(moduleId);
  }

  if (moduleId[0] === '~') {
    moduleId = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] + moduleId.slice(1);
  }

  return require.resolve(moduleId);
};

/**
 * Make sure the Environment present expected methods if an old version is
 * passed to a Generator.
 * @param  {Environment} env
 * @return {Environment} The updated env
 */

Environment.enforceUpdate = function (env) {
  if (!env.adapter) {
    env.adapter = new TerminalAdapter();
  }
  if (!env.runLoop) {
    env.runLoop = new GroupedQueue(['initializing', 'prompting', 'configuring', 'default',
    'writing', 'conflicts', 'install', 'end']);
  }
  return env;
};
