'use strict';
var _ = require('lodash');
var spawn = require('cross-spawn');

/**
 * Normalize a command across OS and spawn it.
 *
 * @param {String} command
 * @param {Array} args
 *
 * @mixin
 * @alias actions/spawn_command
 */

module.exports = function spawnCommand(command, args, opt) {
  opt = opt || {};
  return spawn(command, args, _.defaults({ stdio: 'inherit' }, opt));
};
