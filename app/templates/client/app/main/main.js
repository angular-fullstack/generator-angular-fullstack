'use strict';

angular.module('<%= scriptAppName %>')
  <% if (filters.ngroute) { %>.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<main></main>'
      });
  });<% } %><% if (filters.uirouter) { %>.config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>'
      });
  });<% } %>
