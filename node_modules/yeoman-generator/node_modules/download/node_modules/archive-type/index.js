'use strict';

/**
 * Detect the archive type of a Buffer/Uint8Array
 *
 * @param {Buffer} buf
 * @api public
 */

module.exports = function (buf) {
	if (!buf) {
		return false;
	}

	if (require('is-7zip')(buf)) {
		return '7z';
	}

	if (require('is-bzip2')(buf)) {
		return 'bz2';
	}

	if (require('is-gzip')(buf)) {
		return 'gz';
	}

	if (require('is-rar')(buf)) {
		return 'rar';
	}

	if (require('is-tar')(buf)) {
		return 'tar';
	}

	if (require('is-zip')(buf)) {
		return 'zip';
	}

	return false;
};
