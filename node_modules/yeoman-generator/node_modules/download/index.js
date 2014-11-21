'use strict';

var assign = require('object-assign');
var archiveType = require('archive-type');
var Decompress = require('decompress');
var each = require('each-async');
var fs = require('fs-extra');
var path = require('path');
var Ware = require('ware');

/**
 * Initialize Download
 *
 * @param {Object} opts
 * @api public
 */

function Download(opts) {
    if (!(this instanceof Download)) {
        return new Download();
    }

    this._get = [];
    this.ware = new Ware();
    this.opts = opts || {};
    this.opts.encoding = null;
    this.opts.mode = this.opts.mode || null;
    this.opts.proxy = process.env.HTTPS_PROXY ||
                      process.env.https_proxy ||
                      process.env.HTTP_PROXY ||
                      process.env.http_proxy;
}

/**
 * Add a URL to download
 *
 * @param {String|Object} file
 * @param {String} dest
 * @param {Object} opts
 * @api public
 */

Download.prototype.get = function (file, dest, opts) {
    if (!arguments.length) {
        return this._get;
    }

    if (typeof dest === 'object') {
        opts = dest;
        dest = undefined;
    }

    opts = assign({}, this.opts, opts);

    if (file.url && file.name) {
        this._get.push({ url: file.url, name: file.name, dest: dest, opts: opts });
    } else {
        this._get.push({ url: file, dest: dest, opts: opts });
    }

    return this;
};

/**
 * Add a plugin to the middleware stack
 *
 * @param {Function} plugin
 * @api public
 */

Download.prototype.use = function (plugin) {
    this.ware.use(plugin);
    return this;
};

/**
 * Set proxy
 *
 * @param {String} proxy
 * @api public
 */

Download.prototype.proxy = function (proxy) {
    if (!arguments.length) {
        return this.opts.proxy;
    }

    this.opts.proxy = proxy;
    return this;
};

/**
 * Run
 *
 * @param {Function} cb
 * @api public
 */

Download.prototype.run = function (cb) {
    cb = cb || function () {};

    var files = [];
    var request = require('request');
    var self = this;

    each(this.get(), function (obj, i, done) {
        var name = obj.name || path.basename(obj.url);
        var ret = [];

        request.get(obj.url, obj.opts)
            .on('error', done)

            .on('data', function (data) {
                ret.push(data);
            })

            .on('response', function (res) {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    cb(res.statusCode);
                    return;
                }

                self._run(res, obj);
            })

            .on('end', function () {
                files.push({ url: obj.url, contents: Buffer.concat(ret) });

                if (!obj.dest) {
                    done();
                    return;
                }

                if (obj.opts.extract && archiveType(Buffer.concat(ret))) {
                    return self._extract(Buffer.concat(ret), obj.dest, obj.opts, function (err) {
                        if (err) {
                            done(err);
                            return;
                        }

                        done();
                    });
                }

                self._write(Buffer.concat(ret), path.join(obj.dest, name), obj.opts, function (err) {
                    if (err) {
                        done(err);
                        return;
                    }

                    done();
                });
            });
    }, function (err) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, files);
    });
};

/**
 * Run the response through the middleware
 *
 * @param {Object} res
 * @param {Object} file
 * @api public
 */

Download.prototype._run = function (res, file) {
    this.ware.run(res, file);
};

/**
 * Write to file
 *
 * @param {Buffer} buf
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */

Download.prototype._write = function (buf, dest, opts, cb) {
    fs.outputFile(dest, buf, function (err) {
        if (err) {
            cb(err);
            return;
        }

        if (opts.mode) {
            return fs.chmod(dest, parseInt(opts.mode, 8), function (err) {
                if (err) {
                    cb(err);
                    return;
                }

                cb();
            });
        }

        cb();
    });
};

/**
 * Extract archive
 *
 * @param {Buffer} buf
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */

Download.prototype._extract = function (buf, dest, opts, cb) {
    var decompress = new Decompress(opts)
        .src(buf)
        .dest(dest)
        .use(Decompress.tar(opts))
        .use(Decompress.tarbz2(opts))
        .use(Decompress.targz(opts))
        .use(Decompress.zip(opts));

    decompress.decompress(function (err) {
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

module.exports = Download;
