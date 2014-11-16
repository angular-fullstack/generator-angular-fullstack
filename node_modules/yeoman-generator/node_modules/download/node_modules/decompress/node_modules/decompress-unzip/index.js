'use strict';

var isZip = require('is-zip');
var rm = require('rimraf');
var stripDirs = require('strip-dirs');
var tempWrite = require('temp-write');
var Zip = require('adm-zip');

/**
 * zip decompress plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
    opts = opts || {};
    opts.strip = +opts.strip || 0;

    return function (file, decompress, cb) {
        var files = [];

        if (!isZip(file.contents)) {
            cb();
            return;
        }

        tempWrite(file.contents, function (err, filepath) {
            var zip = new Zip(filepath);

            zip.getEntries().forEach(function (file) {
                if (!file.isDirectory) {
                    file.path = file.entryName.toString();
                    files.push({ contents: file.getData(), path: stripDirs(file.path, opts.strip) });
                }
            });

            decompress.files = files;

            rm(filepath, function (err) {
                if (err) {
                    cb(err);
                    return;
                }

                cb();
            });
        });
    };
};
