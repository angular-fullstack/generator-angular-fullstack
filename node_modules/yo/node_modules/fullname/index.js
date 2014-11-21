'use strict';
var exec = require('child_process').exec;
var fullname;
var first = true;

module.exports = function (cb) {
	if (!first) {
		cb(null, fullname);
		return;
	}

	first = false;

	if (fullname) {
		cb(null, fullname);
		return;
	}

	if (process.platform === 'darwin') {
		exec('id -P', function (err, stdout) {
			fullname = stdout.trim().split(':')[7];

			// `id -P` should never fail as far as I know, but just in case:
			if (err || !fullname) {
				exec('osascript -e "long user name of (system info)"', function (err, stdout) {
					if (err) {
						cb();
						return;
					}

					fullname = stdout.trim();

					cb(null, fullname);
				});
				return;
			} else {
				cb(null, fullname);
			}
		});

		return;
	}

	if (process.platform === 'win32') {
		// try git first since fullname is usually not set by default in the system on Windows 7+
		exec('git config --global user.name', function (err, stdout) {
			fullname = stdout.trim();

			if (err || !fullname) {
				exec('wmic useraccount where name="%username%" get fullname', function (err, stdout) {
					if (err) {
						cb();
						return;
					}

					fullname = stdout.replace('FullName', '').trim();

					cb(null, fullname);
				});
			} else {
				cb(null, fullname);
			}
		});

		return;
	}

	exec('getent passwd $(whoami)', function (err, stdout) {
		fullname = stdout.trim().split(':')[4].replace(/,.*/, '');

		if (err || !fullname) {
			exec('git config --global user.name', function (err, stdout) {
				if (err) {
					cb();
					return;
				}

				fullname = stdout.trim();

				cb(null, fullname);
			});
		} else {
			cb(null, fullname);
		}
	});
};
