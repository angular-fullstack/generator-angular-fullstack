#!/usr/bin/env node
'use strict';
var stdin = require('get-stdin');
var pkg = require('./package.json');
var githubUsername = require('./');
var argv = process.argv.slice(2);
var input = argv[0];

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Usage',
		'    github-username <email> [--token OAUTH-TOKEN]',
		'    echo <email> | github-username',
		'',
		'  Example',
		'    github-username sindresorhus@gmail.com',
		'    sindresorhus'
	].join('\n'));
}

function init(data) {
	var val;
	var token = argv.indexOf('--token');

	if (token !== -1) {
		val = process.argv[token + 1];
	}

	githubUsername(data, val, function (err, username) {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		console.log(username);
	});
}

if (argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

if (process.stdin.isTTY) {
	if (!input) {
		help();
		return;
	}

	init(input);
} else {
	stdin(init);
}
