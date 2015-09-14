'use strict';

(function() {

  function AuthService($http, User, $cookies, $q) {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    var safeCb = function(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

    currentUser = {};

    if ($cookies.get('token')) {
      currentUser = User.get();
    }

    var Auth = {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      login: function(user, callback) {
        return $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .then(function(res) {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(function(user) {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(function(err) {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
      },

      /**
       * Delete access token and user info
       */
      logout: function() {
        $cookies.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function(user, callback) {
        return User.save(user,
          function(data) {
            $cookies.put('token', data.token);
            currentUser = User.get();
            return safeCb(callback)(null, user);
          },
          function(err) {
            Auth.logout();
            return safeCb(callback)(err);
          }).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional, function(error, user)
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function() {
          return safeCb(callback)(null);
        }, function(err) {
          return safeCb(callback)(err);
        }).$promise;
      },

      /**
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
        return $q.when(value)
          .then(function(user) {
            safeCb(callback)(user);
            return user;
          }, function() {
            safeCb(callback)({});
            return {};
          });
      },

      /**
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null)
          .then(function(user) {
            var is = user.hasOwnProperty('role');
            safeCb(callback)(is);
            return is;
          });
      },

       /**
        * Check if a user is an admin
        *   (synchronous|asynchronous)
        *
        * @param  {Function|*} callback - optional, function(is)
        * @return {Bool|Promise}
        */
      isAdmin: function(callback) {
        if (arguments.length === 0) {
          return currentUser.role === 'admin';
        }

        return Auth.getCurrentUser(null)
          .then(function(user) {
            var is = user.role === 'admin';
            safeCb(callback)(is);
            return is;
          });
      },

      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }

  angular.module('<%= scriptAppName %>')
    .factory('Auth', AuthService);

})();
