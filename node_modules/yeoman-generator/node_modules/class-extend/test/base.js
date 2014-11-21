var assert = require('assert');
var sinon = require('sinon');
var Base = require('..');

describe('.extend', function () {
  it('create a new object inheriting the Generator', function () {
    assert.ok(new (Base.extend()) instanceof Base);
  });

  it('pass the extend method along', function () {
    var Sub = Base.extend();
    assert.ok(Sub.extend);
  });

  it('assign prototype methods', function () {
    var proto = { foo: function () {} };
    var Sub = Base.extend(proto);
    assert.equal(Sub.prototype.foo, proto.foo);
  });

  it('assign static methods', function () {
    var staticProps = { foo: function () {} };
    var Sub = Base.extend({}, staticProps);
    assert.equal(Sub.foo, staticProps.foo);
  });

  it('assign __super__ static property', function () {
    assert.equal(Base.extend().__super__, Base.prototype);
  });

  it('allow setting a custom constructor', function () {
    var ctor = sinon.spy();
    var Sub = Base.extend({ constructor: ctor });
    new Sub();
    assert.ok(ctor.calledOnce);
  });

  it('call the parent constructor by default', function () {
    var ctor = sinon.spy();
    ctor.extend = Base.extend;
    var Sub = ctor.extend();
    new Sub();
    assert.ok(ctor.calledOnce);
  });

  it('set constructor as the children', function () {
    var Child = Base.extend();
    assert.equal(Child.prototype.constructor, Child);
  });
});
