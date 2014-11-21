'use strict';
var path = require('path');
var minimist = require('minimist');
var indentString = require('indent-string');
var objectAssign = require('object-assign');
var camelcaseKeys = require('camelcase-keys');

// needed to get the uncached parent
delete require.cache[__filename];
var parentDir = path.dirname(module.parent.filename);

module.exports = function (opts, minimistOpts) {
	opts = objectAssign({
		pkg: './package.json',
		requireInput: true,
		argv: process.argv.slice(2)
	}, opts);

	var pkg = require(path.join(parentDir, opts.pkg));
	var argv = minimist(opts.argv, minimistOpts);
	var errHelp = (opts.requireInput && !argv.help && argv._.length === 0);
	var helpText = '\n' + indentString(pkg.description + (opts.help ? '\n\n' + opts.help : '\n'), '  ');

	if (argv.version) {
		console.log(pkg.version);
		process.exit();
	}

	if (errHelp) {
		console.error(helpText);
		process.exit(1);
	}

	if (argv.help) {
		console.log(helpText);
		process.exit();
	}

	var _ = argv._;
	delete argv._;

	return {
		input: _,
		flags: camelcaseKeys(argv),
		pkg: pkg
	};
};
