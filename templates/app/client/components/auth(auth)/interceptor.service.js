'use strict';

export function authInterceptor($rootScope, $q, $cookies<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>, Util) {
  'ngInject';
  <%_ if (filters.uirouter) { _%>
  var state;<% } %>
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401) {
        <%_ if (filters.ngroute) { _%>
        $location.path('/login');<% } %>
        <%_ if (filters.uirouter) { _%>
        (state || (state = $injector.get('$state'))).go('login');<% } %>
        // remove any stale tokens
        $cookies.remove('token');
      }
      return $q.reject(response);
    }
  };
}
