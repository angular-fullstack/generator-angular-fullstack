'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.extend(
    require('./env/all.js'),
    require('./env/' + process.env.NODE_ENV + '.js') || {});