'use strict';

var floor = Math.floor;

module.exports = function (x) {
	if (isNaN(x)) return NaN;
	x = Number(x);
	if (x === 0) return x;
	if (x === Infinity) return 1;
	if (x === -Infinity) return -1;
	if (x > 0) return floor(x);
	return -floor(-x);
};
