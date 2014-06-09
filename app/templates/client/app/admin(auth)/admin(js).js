'use strict';

angular.module('<%= scriptAppName %>')
  <% if(filters.ngroute) { %>.config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });<% } %><% if(filters.uirouter) { %>.config(function ($urlRouterProvider) {
    $urlRouterProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });<% } %>