'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.merge(
    require('./env/all.js'),
    require('./env/' + process.env.NODE_ENV + '.js') || {});