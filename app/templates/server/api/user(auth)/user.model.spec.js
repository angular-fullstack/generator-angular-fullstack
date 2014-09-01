'use strict';

var app = require('../../app');
var User = require('./user.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model:', function() {

  // Clear users before testing
  before(function() {
    return User.remove().exec();
  });

  describe('User (schema)', function() {

    it('should begin with no users', function() {
      return User.find({}).exec().should.eventually.have.length(0);
    });

  });

  describe('user (instance)', function() {

    describe('.save()', function() {
      // Clear users after tests
      afterEach(function() {
        return User.remove().exec();
      });

      it('should fail when saving a duplicate user', function(done) {
        user.save(function() {
          var userDup = new User(user);
          userDup.save(function(err) {
            err.should.be.instanceOf(Error);
            done();
          });
        });
      });

      it('should fail when saving without an email', function(done) {
        user.email = '';
        user.save(function(err) {
          err.should.be.instanceOf(Error);
          done();
        });
      });

    });

    describe('.authenticate()', function() {

      it("should authenticate user if password is valid", function() {
        return user.authenticate('password').should.be.true;
      });

      it("should not authenticate user if password is invalid", function() {
        return user.authenticate('blah').should.not.be.true;
      });

    });
  });
});
