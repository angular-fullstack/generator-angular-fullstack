'use strict';
var userHome = require('user-home');

module.exports = function (str) {
	return userHome ? str.replace(/^~\//, userHome + '/') : str;
};
