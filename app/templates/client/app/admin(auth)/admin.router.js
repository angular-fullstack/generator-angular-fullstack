'use strict';

angular.module('<%= scriptAppName %>.admin')
  <% if (filters.ngroute) { %>.config(function($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: 'admin'
      });
  });<% } if (filters.uirouter) { %>.config(function($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: 'admin'
      });
  });<% } %>
