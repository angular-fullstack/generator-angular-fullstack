'use strict';

// Make sure app is started and models are bootstrapped
require('../../../server');

var mongoose = require('mongoose'),
    User = mongoose.model('User');

var user;

describe('User Model', function() {
  beforeEach(function(done) {
    user = new User({
      provider: 'local',
      name: 'Fake User',
      email: 'test@test.com',
      password: 'password'
    });

    // Clear users before testing
    User.remove().exec();
    done();
  });

  afterEach(function(done) {
    User.remove().exec();
    done();
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      expect(users.length).toBe(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save();
    var userDup = new User(user);
    userDup.save(function(err) {
      expect(err).toExist();
      done();
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      expect(err).toExist();
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    expect(user.authenticate('password')).toBe(true);
  });

  it("should not authenticate user if password is invalid", function() {
    expect(user.authenticate('blah')).not.toBe(true);
  });

});