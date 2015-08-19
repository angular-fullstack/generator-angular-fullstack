'use strict';

var app = require('../../app');
var User = require('../../sqldb').User;
var user;
var genUser = function() {
  user = User.build({
    provider: 'local',
    name: 'Fake User',
    email: 'test@test.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Sync and clear users before testing
    return User.sync().then(function() {
      return User.destroy({ where: {} });
    });
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.destroy({ where: {} });
  });

  it('should begin with no users', function() {
    return User.findAll()
      .should.eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return user.save()
      .then(function() {
        var userDup = genUser();
        return userDup.save();
      }).should.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving without an email', function() {
      user.email = '';
      return user.save().should.be.rejected;
    });
  });

  describe('#password', function() {
    beforeEach(function() {
      return user.save();
    });

    it('should authenticate user if valid', function() {
      user.authenticate('password').should.be.true;
    });

    it('should not authenticate user if invalid', function() {
      user.authenticate('blah').should.not.be.true;
    });

    it('should remain the same hash unless the password is updated', function() {
      user.name = 'Test User';
      return user.save()
        .then(function(u) {
          return u.authenticate('password');
        }).should.eventually.be.true;
    });
  });

});
