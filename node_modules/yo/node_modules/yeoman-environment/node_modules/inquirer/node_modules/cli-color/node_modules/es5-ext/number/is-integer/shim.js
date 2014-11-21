'use strict';

var toInteger = require('../to-integer');

module.exports = function (value) {
	if (typeof value !== 'number') return false;
	if (!isFinite(value)) return false;
	return toInteger(value) === value;
};
