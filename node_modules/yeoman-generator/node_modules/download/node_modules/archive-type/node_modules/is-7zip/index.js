'use strict';

/**
 * Check if a Buffer/Uint8Array is a 7ZIP file
 *
 * @param {Buffer} buf
 * @api public
 */

module.exports = function (buf) {
    if (!buf || buf.length < 5) {
        return false;
    }

    return buf[0] === 55 && buf[1] === 122 && buf[2] === 188 && buf[3] === 175 && buf[4] === 39 && buf[5] === 28;
};
