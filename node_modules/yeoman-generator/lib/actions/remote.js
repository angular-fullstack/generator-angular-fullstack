'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var fileUtils = require('file-utils');
var rimraf = require('rimraf');

var noop = _.noop;

/**
 * @mixin
 * @alias actions/remote
 */
var remote = module.exports;

/**
 * Remotely fetch a package from github (or an archive), store this into a _cache
 * folder, and provide a "remote" object as a facade API to ourself (part of
 * genrator API, copy, template, directory). It's possible to remove local cache,
 * and force a new remote fetch of the package.
 *
 * ### Examples:
 *
 *     this.remote('user', 'repo', function(err, remote) {
 *       remote.copy('.', 'vendors/user-repo');
 *     });
 *
 *     this.remote('user', 'repo', 'branch', function(err, remote) {
 *       remote.copy('.', 'vendors/user-repo');
 *     });
 *
 *     this.remote('http://foo.com/bar.zip', function(err, remote) {
 *       remote.copy('.', 'vendors/user-repo');
 *     });
 *
 * When fetching from Github
 * @param {String} username
 * @param {String} repo
 * @param {String} branch
 * @param {Function} cb
 * @param {Boolean} refresh
 *
 * @also
 * When fetching an archive
 * @param {String} url
 * @param {Function} cb
 * @param {Boolean} refresh
 */

remote.remote = function () {
  var username;
  var repo;
  var branch;
  var cb;
  var refresh;
  var url;
  var cache;

  if (arguments.length <= 3 && typeof arguments[2] !== 'function') {
    url = arguments[0];
    cb = arguments[1];
    refresh = arguments[2];
    cache = path.join(this.cacheRoot(), _.slugify(url));
  } else {
    username = arguments[0];
    repo = arguments[1];
    branch = arguments[2];
    cb = arguments[3];
    refresh = arguments[4];

    if (!cb) {
      cb = branch;
      branch = 'master';
    }

    cache = path.join(this.cacheRoot(), username, repo, branch);
    url = 'http://github.com/' + [username, repo, 'archive', branch].join('/') + '.tar.gz';
  }

  var self = this;

  var done = function (err) {
    if (err) {
      return cb(err);
    }

    self.remoteDir(cache, cb);
  };

  fs.stat(cache, function (err) {
    // already cached
    if (!err) {
      // no refresh, so we can use this cache
      if (!refresh) {
        return done();
      }

      // otherwise, we need to remove it, to fetch it again
      rimraf(cache, function (err) {
        if (err) {
          return cb(err);
        }
        self.extract(url, cache, { strip: 1 }, done);
      });

    } else {
      self.extract(url, cache, { strip: 1 }, done);
    }
  });

  return this;
};

/**
 * Retrieve a stored directory and use as a remote reference. This is handy if
 * you have files you want to move that may have been downloaded differently to
 * using `this.remote()` (eg such as `node_modules` installed via `package.json`)
 *
 * ### Examples:
 *
 *     this.remoteDir('foo/bar', function(err, remote) {
 *       remote.copy('.', 'vendors/user-repo');
 *     });
 *
 * @param {String} cache
 */
remote.remoteDir = function (cache, cb) {
  var self = this;
  var files = this.expandFiles('**', { cwd: cache, dot: true });

  var remote = {};
  remote.cachePath = cache;

  // simple proxy to `.copy(source, destination)`
  remote.copy = function copy(source, destination) {
    source = path.join(cache, source);
    self.copy(source, destination);
    return this;
  };

  // simple proxy to `.bulkCopy(source, destination)`
  remote.bulkCopy = function copy(source, destination) {
    source = path.join(cache, source);
    self.bulkCopy(source, destination);
    return this;
  };

  // same as `.template(source, destination, data)`
  remote.template = function template(source, destination, data) {
    data = data || self;
    destination = destination || source;
    source = path.join(cache, source);

    var body = self.engine(self.read(source), data);
    self.write(destination, body);
  };

  // same as `.template(source, destination)`
  remote.directory = function directory(source, destination) {
    var root = self.sourceRoot();
    self.sourceRoot(cache);
    self.directory(source, destination);
    self.sourceRoot(root);
  };

  // simple proxy to `.bulkDirectory(source, destination)`
  remote.bulkDirectory = function directory(source, destination) {
    var root = self.sourceRoot();
    self.sourceRoot(cache);
    self.bulkDirectory(source, destination);
    self.sourceRoot(root);
  };

  var fileLogger = { write: noop, warn: noop };

  // Set the file-utils environments
  // Set logger as a noop as logging is handled by the yeoman conflicter
  remote.src = fileUtils.createEnv({
    base: cache,
    dest: self.destinationRoot(),
    logger: fileLogger
  });
  remote.dest = fileUtils.createEnv({
    base: self.destinationRoot(),
    dest: cache,
    logger: fileLogger
  });

  remote.dest.registerValidationFilter('collision', self.getCollisionFilter());
  remote.src.registerValidationFilter('collision', self.getCollisionFilter());

  cb(null, remote, files);
};
