'use strict';

var app = require('../..');
var User = require('./user.model');
var user;
var genUser = function() {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@test.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.removeAsync();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.removeAsync();
  });

  it('should begin with no users', function() {
    return User.findAsync({})
      .should.eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return user.saveAsync()
      .then(function() {
        var userDup = genUser();
        return userDup.saveAsync();
      }).should.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving without an email', function() {
      user.email = '';
      return user.saveAsync().should.be.rejected;
    });
  });

  describe('#password', function() {
    beforeEach(function() {
      return user.saveAsync();
    });

    it('should authenticate user if valid', function() {
      user.authenticate('password').should.be.true;
    });

    it('should not authenticate user if invalid', function() {
      user.authenticate('blah').should.not.be.true;
    });

    it('should remain the same hash unless the password is updated', function() {
      user.name = 'Test User';
      return user.saveAsync()
        .spread(function(u) {
          return u.authenticate('password');
        }).should.eventually.be.true;
    });
  });

});
