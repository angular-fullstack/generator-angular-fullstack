'use strict';

var app = require('../../app');
var <%= classedName %> = require('../../sqldb').<%= classedName %>;
var <%= cameledName %>;
var gen<%= classedName %> = function() {
  <%= cameledName %> = <%= classedName %>.build({
    name: 'Fake <%= classedName %>',
    info: 'some info',
    active: true
  });
  return <%= cameledName %>;
};

describe('<%= classedName %> Model', function() {
  before(function() {
    // Sync and clear <%= basename %>s before testing
    return <%= classedName %>.sync().then(function() {
      return <%= classedName %>.destroy({ where: {} });
    });
  });

  beforeEach(function() {
    gen<%= classedName %>();
  });

  afterEach(function() {
    return <%= classedName %>.destroy({ where: {} });
  });

  it('should begin with no <%= basename %>s', function() {
    return <%= classedName %>.findAll()
      .should.eventually.have.length(0);
  });
});
