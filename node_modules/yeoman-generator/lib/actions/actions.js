'use strict';
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var isBinaryFile = require('isbinaryfile');
var iconv = require('iconv-lite');
var chalk = require('chalk');

/**
 * @mixin
 * @alias actions/actions
 */
var actions = module.exports;

/**
 * Stores and return the cache root for this class. The cache root is used to
 * `git clone` repositories from github by `.remote()` for example.
 */

actions.cacheRoot = function cacheRoot() {
  // we follow XDG specs if possible:
  // http://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html
  if (process.env.XDG_CACHE_HOME) {
    return path.join(process.env.XDG_CACHE_HOME, 'yeoman');
  }

  // otherwise, we fallback to a temp dir in the home
  var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  return path.join(home, '.cache/yeoman');
};

// Copy helper for two versions of copy action
actions._prepCopy = function _prepCopy(source, destination, process) {
  var body;
  destination = destination || source;

  if (typeof destination === 'function') {
    process = destination;
    destination = source;
  }

  source = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  destination = this.isPathAbsolute(destination) ? destination : path.join(this.destinationRoot(), destination);

  var encoding = null;
  var binary = isBinaryFile(source);
  if (!binary) {
    encoding = 'utf8';
  }

  body = fs.readFileSync(source, encoding);

  if (typeof process === 'function' && !binary) {
    body = process(body, source, destination, {
      encoding: encoding
    });
  }

  return {
    body: body,
    encoding: encoding,
    destination: destination,
    source: source
  };
};

/**
 * Make some of the file API aware of our source/destination root paths.
 * `copy`, `template` (only when could be applied/required by legacy code),
 * `write` and alike consider.
 *
 * @param {String} source      Source file to copy from. Relative to this.sourceRoot()
 * @param {String} destination Destination file to write to. Relative to this.destinationRoot()
 * @param {Function} process
 */

actions.copy = function copy(source, destination, process) {

  var file = this._prepCopy(source, destination, process);

  try {
    file.body = this.engine(file.body, this);
  } catch (err) {
    // this happens in some cases when trying to copy a JS file like lodash/underscore
    // (conflicting the templating engine)
  }

  this.checkForCollision(file.destination, file.body, function (err, config) {
    var stats;

    if (err) {
      config.callback(err);
      return this.emit('error', err);
    }

    // create or force means file write, identical or skip prevent the
    // actual write.
    if (!/force|create/.test(config.status)) {
      return config.callback();
    }

    mkdirp.sync(path.dirname(file.destination));
    fs.writeFileSync(file.destination, file.body);

    // synchronize stats and modification times from the original file.
    stats = fs.statSync(file.source);
    try {
      fs.chmodSync(file.destination, stats.mode);
      fs.utimesSync(file.destination, stats.atime, stats.mtime);
    } catch (err) {
      this.log.error('Error setting permissions of "' + chalk.bold(file.destination) + '" file: ' + err);
    }

    config.callback();
  }.bind(this));

  return this;
};

/**
 * Bulk copy
 * https://github.com/yeoman/generator/pull/359
 * https://github.com/yeoman/generator/issues/350
 *
 * A copy method skipping templating and conflict checking. It will allow copying
 * a large amount of files without causing too much recursion errors. You should
 * never use this method, unless there's no other solution.
 *
 * @param {String} source      Source file to copy from. Relative to this.sourceRoot()
 * @param {String} destination Destination file to write to. Relative to this.destinationRoot()
 * @param {Function} process
 */

actions.bulkCopy = function bulkCopy(source, destination, process) {

  var file = this._prepCopy(source, destination, process);

  mkdirp.sync(path.dirname(file.destination));
  fs.writeFileSync(file.destination, file.body);

  // synchronize stats and modification times from the original file.
  var stats = fs.statSync(file.source);
  try {
    fs.chmodSync(file.destination, stats.mode);
    fs.utimesSync(file.destination, stats.atime, stats.mtime);
  } catch (err) {
    this.log.error('Error setting permissions of "' + chalk.bold(file.destination) + '" file: ' + err);
  }

  this.log.create(file.destination);
  return this;
};

/**
 * A simple method to read the content of the a file borrowed from Grunt:
 * https://github.com/gruntjs/grunt/blob/master/lib/grunt/file.js
 *
 * Discussion and future plans:
 * https://github.com/yeoman/generator/pull/220
 *
 * The encoding is `utf8` by default, to read binary files, pass the proper
 * encoding or null. Non absolute path are prefixed by the source root.
 *
 * @param {String} filepath
 * @param {String} [encoding="utf-8"] Character encoding.
 */

actions.read = function read(filepath, encoding) {
  var contents;

  if (!this.isPathAbsolute(filepath)) {
    filepath = path.join(this.sourceRoot(), filepath);
  }

  try {
    contents = fs.readFileSync(String(filepath));

    // if encoding is not explicitly null, convert from encoded buffer to a
    // string. if no encoding was specified, use the default.
    if (encoding !== null) {
      contents = iconv.decode(contents, encoding || 'utf8');

      // strip any BOM that might exist.
      if (contents.charCodeAt(0) === 0xFEFF) {
        contents = contents.substring(1);
      }
    }

    return contents;
  } catch (e) {
    throw new Error('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').');
  }
};

/**
 * Writes a chunk of data to a given `filepath`, checking for collision prior
 * to the file write.
 *
 * @param {String} filepath
 * @param {String} content
 * @param {Object} writeFile An object containing options for the file writing, as shown here: http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback
 */

actions.write = function write(filepath, content, writeFile) {
  this.checkForCollision(filepath, content, function (err, config) {
    if (err) {
      config.callback(err);
      return this.emit('error', err);
    }

    // create or force means file write, identical or skip prevent the
    // actual write
    if (/force|create/.test(config.status)) {
      mkdirp.sync(path.dirname(filepath));
      fs.writeFileSync(filepath, content, writeFile);
    }

    config.callback();
  });
  return this;
};

/**
 * File collision checked. Takes a `filepath` (the file about to be written)
 * and the actual content. A basic check is done to see if the file exists, if
 * it does:
 *
 *   1. Read its content from  `fs`
 *   2. Compare it with the provided content
 *   3. If identical, mark it as is and skip the check
 *   4. If diverged, prepare and show up the file collision menu
 *
 * The menu has the following options:
 *
 *   - `Y` Yes, overwrite
 *   - `n` No, do not overwrite
 *   - `a` All, overwrite this and all others
 *   - `q` Quit, abort
 *   - `d` Diff, show the differences between the old and the new
 *   - `h` Help, show this help
 *
 * @param {String} filepath
 * @param {String} content
 * @param {Function} cb
 */

actions.checkForCollision = function checkForCollision(filepath, content, cb) {
  this.conflicter.add({
    file: filepath,
    content: content
  });

  this.conflicter.once('resolved:' + filepath, function (config) {
    // setImmediate is not available in node 0.8
    var queue = (typeof setImmediate === 'function') ? setImmediate : process.nextTick;
    queue(cb.bind(this, null, config));
  }.bind(this));
};

/**
 * Gets a template at the relative source, executes it and makes a copy
 * at the relative destination. If the destination is not given it's assumed
 * to be equal to the source relative to destination.
 *
 * Use configured engine to render the provided `source` template at the given
 * `destination`. The `destination` path its a template itself and supports variable
 * interpolation. `data` is an optional hash to pass to the template, if undefined,
 * executes the template in the generator instance context.
 *
 * use options to pass parameters to engine (like _.templateSettings)
 *
 * @param {String} source      Source file to read from. Relative to this.sourceRoot()
 * @param {String} destination Destination file to write to. Relative to this.destinationRoot().
 * @param {Object} data        Hash to pass to the template. Leave undefined to use the generator instance context.
 * @param {Object} options
 */

actions.template = function template(source, destination, data, options) {
  data = data || this;
  destination = this.engine(destination || source, data, options);

  if (!this.isPathAbsolute(source)) {
    source = path.join(this.sourceRoot(), this.engine(source, data, options));
  }

  var body = this.read(source, 'utf8');
  var writeFile = { mode: fs.statSync(source).mode };

  body = this.engine(body, data, options);

  this.write(destination, body, writeFile);
  return this;
};

/**
 * The engine method is the function used whenever a template needs to be rendered.
 *
 * It uses the configured engine (default: underscore) to render the `body`
 * template with the provided `data`.
 *
 * use options to pass paramters to engine (like _.templateSettings)
 *
 * @param {String} body
 * @param {Object} data
 * @param {Object} options
 */

actions.engine = function engine(body, data, options) {
  if (!this._engine) {
    throw new Error('Trying to render template without valid engine.');
  }

  return this._engine.detect && this._engine.detect(body) ?
    this._engine(body, data, options) :
    body;
};

// Shared directory method
actions._directory = function _directory(source, destination, process, bulk) {
  // Only add sourceRoot if the path is not absolute
  var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', { dot: true, cwd: root });

  destination = destination || source;

  if (typeof destination === 'function') {
    process = destination;
    destination = source;
  }

  var cp = this.copy;
  if (bulk) {
    cp = this.bulkCopy;
  }

  // get the path relative to the template root, and copy to the relative destination
  for (var i in files) {
    var dest = path.join(destination, files[i]);
    cp.call(this, path.join(root, files[i]), dest, process);
  }

  return this;
};

/**
 * Copies recursively the files from source directory to root directory.
 *
 * @param {String} source      Source directory to copy from. Relative to this.sourceRoot()
 * @param {String} destination Directory to copy the source files into. Relative to this.destinationRoot().
 * @param {Function} process
 */

actions.directory = function directory(source, destination, process) {
  return this._directory(source, destination, process);
};

/**
 * Copies recursively the files from source directory to root directory.
 *
 * A copy method skiping templating and conflict checking. It will allow copying
 * a large amount of files without causing too much recursion errors. You should
 * never use this method, unless there's no other solution.
 *
 * @param {String} source      Source directory to copy from. Relative to this.sourceRoot()
 * @param {String} destination Directory to copy the source files into.Relative to this.destinationRoot().
 * @param {Function} process
 */

actions.bulkDirectory = function directory(source, destination, process) {
  // Join the source here because the conflicter will not run
  // until next tick, which resets the source root on remote
  // bulkCopy operations
  source = path.join(this.sourceRoot(), source);
  this.checkForCollision(destination, null, function (err, config) {
    // create or force means file write, identical or skip prevent the
    // actual write.
    if (!/force|create/.test(config.status)) {
      return config.callback();
    }

    this._directory(source, destination, process, true);
    config.callback();
  });
  return this;
};
