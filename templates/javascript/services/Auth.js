'use strict';

angular.module('<%= scriptAppName %>')
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {

      /**
       * Authenticate user
       * @param  {String}   provider - passport auth strategy
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
      login: function(provider, user, callback) {
        var cb = callback || angular.noop;

        return Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Unauthenticate the current user
       * @param  {Function} callback - optional
       * @return {Promise}           
       */
      logout: function(callback) {
        var cb = callback || angular.noop;

        return Session.delete(function() {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
       * Create a new user
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
       * Get current authenticated user
       * @return {Promise}
       */
      currentUser: function() {
        return Session.get(function(user) {
          $rootScope.currentUser = user;
        }).$promise;
      },

      /**
       * Update password
       * @param  {String}   email       
       * @param  {String}   oldPassword 
       * @param  {String}   newPassword 
       * @param  {Function} callback    - optional
       * @return {Promise}              
       */
      changePassword: function(email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Delete account
       * @param  {String}   email    
       * @param  {String}   password 
       * @param  {Function} callback - optional
       * @return {Promise}           
       */
      removeUser: function(email, password, callback) {
        var cb = callback || angular.noop;

        return User.delete({
          email: email,
          password: password
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      }
    };
  });