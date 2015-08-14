'use strict';

var app = require('../../app');
var <%= classedName %> = require('./<%= basename %>.model');
var <%= cameledName %>;
var gen<%= classedName %> = function() {
  <%= cameledName %> = new <%= classedName %>({
    name: 'Fake <%= classedName %>',
    info: 'some info',
    active: true
  });
  return <%= cameledName %>;
};

describe('<%= classedName %> Model', function() {
  before(function() {
    // Clear <%= basename %>s before testing
    return <%= classedName %>.find({}).removeAsync();
  });

  beforeEach(function() {
    gen<%= classedName %>();
  });

  afterEach(function() {
    return <%= classedName %>.find({}).removeAsync();
  });

  it('should begin with no <%= basename %>s', function() {
    return <%= classedName %>.findAsync({})
      .should.eventually.have.length(0);
  });

});
