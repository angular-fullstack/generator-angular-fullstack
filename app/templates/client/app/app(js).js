'use strict';

angular.module('<%= scriptAppName %>', [<%- angularModules %>])
  .config(function(<% if (filters.ngroute) { %>$routeProvider<% } if (filters.uirouter) { %>$urlRouterProvider<% } %>, $locationProvider) {<% if (filters.ngroute) { %>
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });<% } if (filters.uirouter) { %>
    $urlRouterProvider
      .otherwise('/');<% } %>

    $locationProvider.html5Mode(true);
  })<% if (filters.auth) { %>

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
