'use strict';

angular.module('<%= scriptAppName %>')
  <% if(filters.ngroute) { %>.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });<% } %><% if(filters.uirouter) { %>.config(function ($urlRouterProvider) {
    $urlRouterProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });<% } %>