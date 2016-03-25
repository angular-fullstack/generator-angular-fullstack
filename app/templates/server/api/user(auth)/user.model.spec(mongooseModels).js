'use strict';

import app from '../..';
import User from './user.model';
var user;
var genUser = function() {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.remove();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.remove();
  });

  it('should begin with no users', function() {
    return <%= expect() %>User.find({}).exec()<%= to() %>
      .eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return <%= expect() %>user.save()
      .then(function() {
        var userDup = genUser();
        return userDup.save();
      })<%= to() %>.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving with a blank email', function() {
      user.email = '';
      return <%= expect() %>user.save()<%= to() %>.be.rejected;
    });

    it('should fail when saving without an email', function() {
      user.email = null;
      return <%= expect() %>user.save()<%= to() %>.be.rejected;
    });<% if (filters.oauth && filters.googleAuth) { %>

    context('given user provider is google', function() {
      beforeEach(function() {
        user.provider = 'google';
      });

      it('should succeed when saving without an email', function() {
        user.email = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth && filters.facebookAuth) { %>

    context('given user provider is facebook', function() {
      beforeEach(function() {
        user.provider = 'facebook';
      });

      it('should succeed when saving without an email', function() {
        user.email = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth && filters.twitterAuth) { %>

    context('given user provider is twitter', function() {
      beforeEach(function() {
        user.provider = 'twitter';
      });

      it('should succeed when saving without an email', function() {
        user.email = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth) { %>

    context('given user provider is github', function() {
      beforeEach(function() {
        user.provider = 'github';
      });

      it('should succeed when saving without an email', function() {
        user.email = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %>
  });

  describe('#password', function() {
    it('should fail when saving with a blank password', function() {
      user.password = '';
      return <%= expect() %>user.save()<%= to() %>.be.rejected;
    });

    it('should fail when saving without a password', function() {
      user.password = null;
      return <%= expect() %>user.save()<%= to() %>.be.rejected;
    });

    context('given the user has been previously saved', function() {
      beforeEach(function() {
        return user.save();
      });

      it('should authenticate user if valid', function() {
        <%= expect() %>user.authenticate('password')<%= to() %>.be.true;
      });

      it('should not authenticate user if invalid', function() {
        <%= expect() %>user.authenticate('blah')<%= to() %>.not.be.true;
      });

      it('should remain the same hash unless the password is updated', function() {
        user.name = 'Test User';
        return <%= expect() %>user.save()
          .then(function(u) {
            return u.authenticate('password');
          })<%= to() %>.eventually.be.true;
      });
    });<% if (filters.oauth && filters.googleAuth) { %>

    context('given user provider is google', function() {
      beforeEach(function() {
        user.provider = 'google';
      });

      it('should succeed when saving without a password', function() {
        user.password = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth && filters.facebookAuth) { %>

    context('given user provider is facebook', function() {
      beforeEach(function() {
        user.provider = 'facebook';
      });

      it('should succeed when saving without a password', function() {
        user.password = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth && filters.twitterAuth) { %>

    context('given user provider is twitter', function() {
      beforeEach(function() {
        user.provider = 'twitter';
      });

      it('should succeed when saving without a password', function() {
        user.password = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %><% if (filters.oauth) { %>

    context('given user provider is github', function() {
      beforeEach(function() {
        user.provider = 'github';
      });

      it('should succeed when saving without a password', function() {
        user.password = null;
        return <%= expect() %>user.save()<%= to() %>.be.fulfilled;
      });
    });<% } %>
  });

});
