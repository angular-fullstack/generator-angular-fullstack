/* globals jasmine, beforeEach */
'use strict';

// Import lodash: support both node and browser
var _;
if (typeof exports === 'object') {
  // Node.
  _ = require('lodash');
} else {
  // Browser global;
  _ = window._;
}

// Custom matchers
beforeEach(function() {

  this.addMatchers({

    toExist: function() {
      return !_.isUndefined(this.actual) && !_.isNull(this.actual);
    },

    toBeInstanceof: function(expected) {
      return this.actual instanceof expected;
    },

    toExtend: function(expected) {
      this.message = function() {
        return 'Expected ' + this.actual + ' to extend ' + expected;
      };

      return new this.actual() instanceof expected;
    },

    toBeArray: function() {
      this.message = function() {
        return 'Expected ' + this.actual + ' to be an array';
      };

      return _.isArray(this.actual);
    },

    toBeRegularExpression: function () {
      if (!this.actual || !_.isFunction(this.actual.exec) || !_.isFunction(this.actual.test)) {
        return 'Expected ' + this.actual + ' to be an a regular expression';
      }

      return true;
    },

    toBeFunction: function() {
      this.message = function() {
        return 'Expected ' + this.actual + ' to be a function';
      };

      return _.isFunction(this.actual);
    },

    toDeepEqual: function(expected) {
      this.message = function() {
        return 'Expected \n' + jasmine.pp(this.actual) + '\n to deep equal \n' + jasmine.pp(expected);
      };

      return _.isEqual(this.actual, expected);
    }
  });
});