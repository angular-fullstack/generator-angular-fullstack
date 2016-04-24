'use strict';
var Insight = require('insight');
var pkg = require('../package.json');

var insight = new Insight({
    // Google Analytics tracking code
    trackingCode: 'UA-48443700-4',
    pkg: pkg
});

if(process.stdout.isTTY === undefined) insight.optOut = false;

// ask for permission the first time
// if(insight.optOut === undefined) {
//     insight.askPermission();
// }

// insight.track('foo', 'bar');
// recorded in Analytics as `/foo/bar`

module.exports = insight;
