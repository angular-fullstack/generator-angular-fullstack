'use strict';
var os = require('os');

var win32 = {
	'6.4': '10',
	'6.3': '8.1',
	'6.2': '8',
	'6.1': '7',
	'6.0': 'Vista',
	'5.1': 'XP',
	'5.0': '2000',
	'4.9': 'ME',
	'4.1': '98',
	'4.0': '95'
};

module.exports = function (platform, release) {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specfying `platform`');
	}

	platform = platform || os.platform();
	release = release || os.release();

	var id;

	if (platform === 'darwin') {
		id = require('osx-release')(release).name;
		return 'OS X' + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		id = release.replace(/^(\d+\.\d+).*/, '$1');
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		id = win32[release.slice(0, 3)];
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};
