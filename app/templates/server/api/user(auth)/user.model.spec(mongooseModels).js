'use strict';

var app = require('../../app');
var User = require('./user.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.remove().exec();
  });

  afterEach(function() {
    return User.remove().exec();
  });

  it('should begin with no users', function() {
    return User.findAsync({})
      .should.eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return user.saveAsync()
      .then(function() {
        var userDup = new User(user);
        return userDup.saveAsync();
      }).should.be.rejected;
  });

  it('should fail when saving without an email', function() {
    user.email = '';
    return user.saveAsync().should.be.rejected;
  });

  it('should authenticate user if password is valid', function() {
    user.authenticate('password').should.be.true;
  });

  it('should not authenticate user if password is invalid', function() {
    user.authenticate('blah').should.not.be.true;
  });
});
