'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  <% if(filters.ngroute) { %>.config(function ($routeProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);<% if(filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } %><% if(filters.uirouter) { %>.config(function ($stateProvider, $urlRouterProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);<% if(filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } %><% if(filters.auth) { %>

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  })<% } %>;