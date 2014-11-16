#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var osName = require('./');

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Example',
		'    os-name',
		'    OS X Mavericks'
	].join('\n'));
}

if (argv.help) {
	help();
	return;
}

if (argv.version) {
	console.log(pkg.version);
	return;
}

console.log(osName());
