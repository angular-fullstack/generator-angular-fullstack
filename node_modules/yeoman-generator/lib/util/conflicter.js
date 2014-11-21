'use strict';

var fs = require('fs');
var path = require('path');
var events = require('events');
var assert = require('assert');
var async = require('async');
var isBinaryFile = require('isbinaryfile');
var util = require('util');

var Conflicter = module.exports = function Conflicter(adapter) {
  events.EventEmitter.call(this);
  this.adapter = adapter;
  this.conflicts = [];
};

util.inherits(Conflicter, events.EventEmitter);

Conflicter.prototype.add = function add(conflict) {
  if (typeof conflict === 'string') {
    conflict = {
      file: conflict,
      content: fs.readFileSync(conflict, 'utf8')
    };
  }

  assert(conflict.file, 'Missing conflict.file option');
  assert(conflict.content !== undefined, 'Missing conflict.content option');

  this.conflicts.push(conflict);
  return this;
};

Conflicter.prototype.reset = function reset() {
  this.conflicts = [];
  return this;
};

Conflicter.prototype.pop = function pop() {
  return this.conflicts.pop();
};

Conflicter.prototype.shift = function shift() {
  return this.conflicts.shift();
};

Conflicter.prototype.resolve = function resolve(cb) {
  var resolveConflicts = function (conflict) {
    return function (next) {
      if (!conflict) {
        return next();
      }

      this.collision(conflict.file, conflict.content, function (status) {
        this.emit('resolved:' + conflict.file, {
          status: status,
          callback: next
        });
      }.bind(this));
    }.bind(this);
  }.bind(this);

  async.series(this.conflicts.map(resolveConflicts), function (err) {
    if (err) {
      cb();
      return this.emit('error', err);
    }

    this.reset();
    cb();
  }.bind(this));
};

Conflicter.prototype._ask = function (filepath, content, cb) {
  // for this particular use case, might use prompt module directly to avoid
  // the additional "Are you sure?" prompt

  var self = this;
  var rfilepath = path.relative(process.cwd(), path.resolve(filepath));

  var config = [{
    type: 'expand',
    message: 'Overwrite ' + rfilepath + '?',
    choices: [{
      key: 'y',
      name: 'overwrite',
      value: function (cb) {
        self.adapter.log.force(rfilepath);
        return cb('force');
      }
    }, {
      key: 'n',
      name: 'do not overwrite',
      value: function (cb) {
        self.adapter.log.skip(rfilepath);
        return cb('skip');
      }
    }, {
      key: 'a',
      name: 'overwrite this and all others',
      value: function (cb) {
        self.adapter.log.force(rfilepath);
        self.force = true;
        return cb('force');
      }
    }, {
      key: 'x',
      name: 'abort',
      value: function () {
        self.adapter.log.writeln('Aborting ...');
        return process.exit(0);
      }
    }, {
      key: 'd',
      name: 'show the differences between the old and the new',
      value: function (cb) {
        self.diff(fs.readFileSync(filepath, 'utf8'), content);
        return self._ask(filepath, content, cb);
      }
    }],
    name: 'overwrite'
  }];

  process.nextTick(function () {
    this.emit('prompt', config);
    this.emit('conflict', filepath);
  }.bind(this));

  this.adapter.prompt(config, function (result) {
    result.overwrite(function (action) {
      cb(action);
    });
  });
};

Conflicter.prototype.collision = function collision(filepath, content, cb) {
  var rfilepath = path.relative(process.cwd(), path.resolve(filepath));
  if (!fs.existsSync(filepath)) {
    this.adapter.log.create(rfilepath);
    return cb('create');
  }

  if (!fs.statSync(path.resolve(filepath)).isDirectory()) {
    var encoding = null;
    if (!isBinaryFile(path.resolve(filepath))) {
      encoding = 'utf8';
    }

    var actual = fs.readFileSync(path.resolve(filepath), encoding);

    // In case of binary content, `actual` and `content` are `Buffer` objects,
    // we just can't compare those 2 objects with standard `===`,
    // so we convert each binary content to an hexadecimal string first, and then compare them with standard `===`
    //
    // For not binary content, we can directly compare the 2 strings this way
    if ((!encoding && (actual.toString('hex') === content.toString('hex'))) ||
      (actual === content)) {
      this.adapter.log.identical(rfilepath);
      return cb('identical');
    }
  }

  if (this.force) {
    this.adapter.log.force(rfilepath);
    return cb('force');
  }

  this.adapter.log.conflict(rfilepath);
  this._ask(filepath, content, cb);
};

// below is borrowed code from visionmedia's excellent mocha (and its reporter)
Conflicter.prototype.diff = function _diff(actual, expected) {
  return this.adapter.diff(actual, expected);
};
