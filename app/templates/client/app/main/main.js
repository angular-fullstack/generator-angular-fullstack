'use strict';

angular.module('<%= scriptAppName %>')
  <% if (filters.ngroute) { %>.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<main-component></main-component>'
      });
  });<% } %><% if (filters.uirouter) { %>.config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main-component></main-component>'
      });
  });<% } %>
