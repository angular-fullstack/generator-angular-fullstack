#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var fullname = require('./');
var argv = process.argv.slice(2);

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Example',
		'    fullname',
		'    Sindre Sorhus'
	].join('\n'));
}

if (argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

fullname(function (err, name) {
	console.log(name);
});
