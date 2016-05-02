'use strict';

global.DEBUG = !!process.env.DEBUG;

var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);
