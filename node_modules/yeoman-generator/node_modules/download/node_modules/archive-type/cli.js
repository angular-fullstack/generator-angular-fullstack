#!/usr/bin/env node
'use strict';

var archiveType = require('./');
var meow = require('meow');
var readChunk = require('read-chunk');
var stdin = require('get-stdin');

/**
 * Initialize CLI
 */

var cli = meow({
	help: [
		'Usage',
		'  archive-type <file>',
		'  cat <file> | archive-type',
		'',
		'Example',
		'  archive-type foo.tar.gz',
		'  cat foo.tar.gz | archive-type'
	].join('\n')
});

/**
 * Run
 */

function run(data) {
	var type = archiveType(new Buffer(data));

	if (!type) {
		console.error('Not a recognized archive');
		process.exit(1);
	}

	console.log(type);
}

/**
 * Get stdin
 */

if (process.stdin.isTTY) {
	if (!cli.input.length) {
		console.error([
			'Specify a valid archive file',
			'',
			'Example',
			'  archive-type foo.tar.gz',
			'  cat foo.tar.gz | archive-type'
		].join('\n'));

		process.exit(1);
	}

	readChunk(cli.input[0], 0, 262, function (err, buf) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}

		run(buf);
	});
} else {
	stdin.buffer(run);
}
