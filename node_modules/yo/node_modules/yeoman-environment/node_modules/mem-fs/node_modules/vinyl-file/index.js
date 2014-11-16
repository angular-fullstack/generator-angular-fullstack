'use strict';
var path = require('path');
var fs = require('graceful-fs');
var stripBom = require('strip-bom');
var File = require('vinyl');

exports.read = function (pth, opts, cb) {
	opts = opts || {};

	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	fs.stat(pth, function (err, stat) {
		if (err) {
			cb(err);
			return;
		}

		var cwd = opts.cwd || process.cwd();
		var base = opts.base || cwd;

		var file = new File({
			cwd: cwd,
			base: base,
			path: path.resolve(pth),
			stat: stat,
		});

		if (opts.read === false) {
			cb(null, file);
			return;
		}

		if (opts.buffer === false) {
			file.contents = fs.createReadStream(pth).pipe(stripBom.stream());
			cb(null, file);
			return;
		}

		fs.readFile(pth, function (err, buf) {
			if (err) {
				cb(err);
				return;
			}

			file.contents = stripBom(buf);
			cb(null, file);
		});
	});
};

exports.readSync = function (pth, opts) {
	opts = opts || {};

	var contents;

	if (opts.read !== false) {
		contents = opts.buffer === false ?
			fs.createReadStream(pth).pipe(stripBom.stream()) :
			stripBom(fs.readFileSync(pth));
	}

	return new File({
		cwd: opts.cwd || process.cwd(),
		base: opts.base || process.cwd(),
		path: path.resolve(pth),
		stat: fs.statSync(pth),
		contents: contents
	});
};
