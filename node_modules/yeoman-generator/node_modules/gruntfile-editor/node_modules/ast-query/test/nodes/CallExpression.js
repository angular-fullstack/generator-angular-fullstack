/*globals describe, it, beforeEach */
var assert = require('assert');
var program = require('../..');

var ObjectExpression = require('../../lib/nodes/ObjectExpression.js');
var Literal = require('../../lib/nodes/Literal.js');

describe('CallExpression objects', function () {
  beforeEach(function () {
    this.tree1 = program('foo(1);');
    this.tree2 = program('bar.foo();');
    this.tree3 = program('bar.doe.foo();');
  });

  it('selects function call', function () {
    assert.equal(this.tree1.callExpression('foo').length, 1);
  });

  it('selects method call', function () {
    assert.equal(this.tree2.callExpression('bar.foo').length, 1);
    assert.equal(this.tree3.callExpression('bar.doe.foo').length, 1);
  });

  describe('#arguments', function () {
    describe('#push()', function () {
      it('add argument to the end', function () {
        this.tree1.callExpression('foo').arguments.push('["a"]');
        assert.equal(this.tree1.toString(), 'foo(1, [\'a\']);');
      });
    });

    describe('#unshift()', function () {
      it('add argument to the start', function () {
        this.tree1.callExpression('foo').arguments.unshift('2');
        assert.equal(this.tree1.toString(), 'foo(2, 1);');
      });
    });

    describe('#at()', function () {
      beforeEach(function () {
        this.tree = program('foo(1, { a : "b" }, "foo", b);');
      });

      it('returns argument at given index', function () {
        assert.equal(this.tree.callExpression('foo').arguments.at(0).value(), 1);
        assert.equal(this.tree.callExpression('foo').arguments.at(2).value(), 'foo');
      });

      it('returns wrapped node', function () {
        assert(this.tree.callExpression('foo').arguments.at(0) instanceof Literal);
        assert(this.tree.callExpression('foo').arguments.at(1) instanceof ObjectExpression);
      });
    });
  });
});
