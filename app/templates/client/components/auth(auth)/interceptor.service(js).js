'use strict';

(function() {

  function authInterceptor($rootScope, $q, $cookies<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>) {
    <% if (filters.uirouter) { %>var state;
    <% } %>return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          <% if (filters.ngroute) { %>$location.path('/login');<% } if (filters.uirouter) { %>(state || (state = $injector.get('$state'))).go('login');<% } %>
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }

  angular.module('<%= scriptAppName %>.auth')
    .factory('authInterceptor', authInterceptor);

})();
