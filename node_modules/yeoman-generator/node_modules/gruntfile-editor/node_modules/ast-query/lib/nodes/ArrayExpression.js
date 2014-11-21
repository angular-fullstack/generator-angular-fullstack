var valueFactory = require('../factory/value.js');
var Base = require('./Base');

var ArrayExpression = module.exports = Base.extend({
  /**
   * push a new value in the array
   * @param  {String} arg New value as a string
   * @return {this}
   */
  push: function (arg) {
    arg = valueFactory.create(arg);
    this.nodes.forEach(function (node) {
      node.push(arg);
    });
    return this;
  },

  /**
   * unshift a new value in the array
   * @param  {String} arg New value as a string
   * @return {this}
   */
  unshift: function (arg) {
    arg = valueFactory.create(arg);
    this.nodes.forEach(function (node) {
      node.unshift(arg);
    });
    return this;
  },

  /**
   * Return the value at given index (only target the first node occurence)
   * @param  {Number}  index
   * @return {Literal} Value reference as a literal type
   */
  at: function (index) {
    return valueFactory.wrap(this.nodes[0][index]);
  }

});

