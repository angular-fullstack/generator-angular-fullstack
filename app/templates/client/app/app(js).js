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
  });
