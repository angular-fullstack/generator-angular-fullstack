'use strict';
var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

/**
 * @mixin
 * @alias actions/string
 */
var string = module.exports;

/**
 * Mix in non-conflicting functions to underscore namespace and generators.
 *
 * @mixes lodash
 * @mixes underscore.string
 * @example
 *
 *     this._.humanize('stuff-dash');
 *     this._.classify('hello-model');
 */

string._ = _;
