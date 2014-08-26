'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

describe('User Model', function() {
  var user;

  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    // Start from scratch
    user = new User({
      provider: 'local',
      name: 'Fake User',
      email: 'test@test.com',
      password: 'password'
    });

    // Clear all users
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function(done) {
    user.save(function(err, newUser) {
      newUser.authenticate('password', function(authErr, authenticated) {
        authenticated.should.be.true;
        done();
      });
    });
  });

  it("should not authenticate user if password is invalid", function(done) {
    user.save(function(err, newUser) {
      newUser.authenticate('invalidPassword', function(authErr, authenticated) {
        authenticated.should.not.be.true;
        done();
      });
    });
  });

  it("should authenticate after updating password", function(done) {
    user.save(function(err, newUser) {
      newUser.password = 'newPassword';
      newUser.save(function() {
        newUser.authenticate('newPassword', function(authErr, authenticated) {
          authenticated.should.be.true;
          done();
        });
      });
    });
  });

});
