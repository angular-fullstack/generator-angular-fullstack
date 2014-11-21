'use strict';

var each = require('each-async');
var fs = require('fs-extra');
var path = require('path');
var Ware = require('ware');

/**
 * Initialize Decompress
 *
 * @param {Object} opts
 * @api public
 */

function Decompress(opts) {
    if (!(this instanceof Decompress)) {
        return new Decompress();
    }

    this.opts = opts || {};
    this.opts.mode = parseInt(this.opts.mode, 8) || null;
    this.ware = new Ware();
}

/**
 * Add a plugin to the middleware stack
 *
 * @param {Function} plugin
 * @api public
 */

Decompress.prototype.use = function (plugin) {
    this.ware.use(plugin);
    return this;
};

/**
 * Get or set the source file
 *
 * @param {String|Buffer} file
 * @api public
 */

Decompress.prototype.src = function (file) {
    if (!arguments.length) {
        return this._src;
    }

    this._src = file;
    return this;
};

/**
 * Get or set the destination path
 *
 * @param {String} path
 * @api public
 */

Decompress.prototype.dest = function (path) {
    if (!arguments.length) {
        return this._dest;
    }

    this._dest = path;
    return this;
};

/**
 * Decompress archive
 *
 * @param {Function} cb
 * @api public
 */

Decompress.prototype.decompress = function (cb) {
    cb = cb || function () {};
    var self = this;

    this.read(function (err, file) {
        if (!file || file.contents.length === 0) {
            cb();
            return;
        }

        if (err) {
            cb(err);
            return;
        }

        self.run(file, function (err) {
            if (err) {
                cb(err);
                return;
            }

            self.write(self.files, function (err) {
                cb(err, file);
            });
        });
    });
};

/**
 * Run a file through the middleware
 *
 * @param {Object} file
 * @param {Function} cb
 * @api public
 */

Decompress.prototype.run = function (file, cb) {
    this.ware.run(file, this, cb);
};

/**
 * Read the archive
 *
 * @param {Function} cb
 * @api public
 */

Decompress.prototype.read = function (cb) {
    var file = {};
    var src = this.src();

    if (Buffer.isBuffer(src)) {
        file.contents = src;
        cb(null, file);
        return;
    }

    fs.readFile(src, function (err, buf) {
        if (err) {
            cb(err);
            return;
        }

        file.contents = buf;
        file.path = src;

        cb(null, file);
    });
};

/**
 * Write files to destination
 *
 * @param {Array} files
 * @param {Function} cb
 * @api public
 */

Decompress.prototype.write = function (files, cb) {
    var dest = this.dest();
    var mode = this.opts.mode;

    if (!dest || !files) {
        cb();
        return;
    }

    each(files, function (file, i, done) {
        fs.outputFile(path.join(dest, file.path), file.contents, function (err) {
            if (err) {
                done(err);
                return;
            }

            if (mode) {
                return fs.chmod(path.join(dest, file.path), mode, function (err) {
                    if (err) {
                        cb(err);
                        return;
                    }

                    done();
                });
            }

            done();
        });
    }, function (err) {
        if (err) {
            cb(err);
            return;
        }

        cb();
    });
};

/**
 * Module exports
 */

module.exports = Decompress;
module.exports.tar = require('decompress-tar');
module.exports.tarbz2 = require('decompress-tarbz2');
module.exports.targz = require('decompress-targz');
module.exports.zip = require('decompress-unzip');
