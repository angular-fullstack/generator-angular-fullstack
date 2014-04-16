/* globals jasmine, beforeEach */
'use strict';

// Import lodash: support both node and browser
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('lodash'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._);
    }
}(this, function (_) {

  // Custom matchers
  beforeEach(function() {

    this.addMatchers({

      toExist: function() {
        return !_.isUndefined(this.actual) && !_.isNull(this.actual);
      },

      toExtend: function(expected) {
        return new this.actual() instanceof expected;
      },

      toBeArray: function() {
        return _.isArray(this.actual);
      },

      toBeBoolean: function() {
        return _.isBoolean(this.actual);
      },

      toBeDate: function() {
        return _.isDate(this.actual);
      },

      toDeepEqual: function(expected) {
        return _.isEqual(this.actual, expected);
      },

      toBeEmpty: function() {
        return _.isEmpty(this.actual);
      },

      toBeFinite: function() {
        return _.isFinite(this.actual);
      },

      toBeFunction: function() {
        return _.isFunction(this.actual);
      },

      toBeInstanceof: function(expected) {
        return this.actual instanceof expected;
      },

      toBeNaN: function() {
        return _.isNaN(this.actual);
      },

      toBeNull: function() {
        return _.isNull(this.actual);
      },

      toBeNumber: function() {
        return _.isNumber(this.actual);
      },

      toBeRegularExpression: function () {
        return _.isRegExp(this.actual);
      },

      toBePlainObject: function() {
        return _.isPlainObject(this.actual);
      },

      toBeString: function() {
        return _.isString(this.actual);
      },

      toBeUndefined: function() {
        return _.isUndefined(this.actual);
      }

    });
  });
}));