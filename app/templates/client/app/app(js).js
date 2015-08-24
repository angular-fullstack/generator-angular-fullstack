'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  <% if (filters.ngroute) { %>.config(function($routeProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);<% if (filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } if (filters.uirouter) { %>.config(function($stateProvider, $urlRouterProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);<% if (filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } if (filters.auth) { %>

  .factory('authInterceptor', function($rootScope, $q, $cookies<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>) {
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
  })

  .run(function($rootScope<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $state<% } %>, Auth) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on(<% if (filters.ngroute) { %>'$routeChangeStart'<% } %><% if (filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function(loggedIn) {
          if (!loggedIn) {
            event.preventDefault();
            <% if (filters.ngroute) { %>$location.path('/login');<% } if (filters.uirouter) { %>$state.go('login');<% } %>
          }
        });
      }
    });
  })<% } %>;
