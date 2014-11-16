// https://github.com/paulmillr/es6-shim
// ES6 isInteger Polyfill https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
module.exports = Number.isInteger || function(val) {
	return typeof val === "number" &&
		! Number.isNaN(val) &&
		Number.isFinite(val) &&
		val > -9007199254740992 &&
		val < 9007199254740992 &&
		parseInt(val, 10) === val;
};
