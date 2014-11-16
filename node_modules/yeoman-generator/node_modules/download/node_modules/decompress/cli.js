#!/usr/bin/env node
'use strict';

var Decompress = require('./');
var fs = require('fs');
var nopt = require('nopt');
var pkg = require('./package.json');

/**
 * Options
 */

var opts = nopt({
    help: Boolean,
    mode: Number,
    strip: String,
    version: Boolean
}, {
    h: '--help',
    m: '--mode',
    s: '--strip',
    v: '--version'
});

/**
 * Help screen
 */

function help() {
    console.log(pkg.description);
    console.log('');
    console.log('Usage');
    console.log('  $ decompress <file> [directory]');
    console.log('');
    console.log('Example');
    console.log('  $ decompress --strip 1 file.zip out');
    console.log('');
    console.log('Options');
    console.log('  -m, --mode     Set mode on the extracted files');
    console.log('  -s, --strip    Equivalent to --strip-components for tar');
}

/**
 * Show help
 */

if (opts.help) {
    help();
    return;
}

/**
 * Show package version
 */

if (opts.version) {
    console.log(pkg.version);
    return;
}

/**
 * Check if path is a file
 *
 * @param {String} path
 * @api private
 */

function isFile(path) {
    try {
        return fs.statSync(path).isFile();
    } catch (e) {
        return false;
    }
}

/**
 * Run
 *
 * @param {String} input
 * @param {String} output
 * @param {Object} opts
 * @api private
 */

function run(input, output, opts) {
    var decompress = new Decompress(opts)
        .src(input)
        .dest(output)
        .use(Decompress.tar(opts))
        .use(Decompress.targz(opts))
        .use(Decompress.zip(opts));

    decompress.decompress(function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
}

/**
 * Apply arguments
 */

var input = opts.argv.remain;
var output = process.cwd();

if (input.length === 0) {
    help();
    return;
}

if (input.length > 1 && !isFile(input[input.length - 1])) {
    output = input[input.length - 1];
    input.pop();
}

run(input.join(), output, opts);
