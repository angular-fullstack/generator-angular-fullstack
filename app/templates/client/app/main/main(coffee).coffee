'use strict'

angular.module('<%= scriptAppName %>')
  <% if(filters.ngroute) { %>.config ($routeProvider) ->
    $routeProvider
    .when('/',
      templateUrl: 'app/main/main.html'
      controller: 'MainCtrl'
    )<% } %><% if(filters.uirouter) { %>.config ($stateProvider) ->
    $stateProvider
    .state('main',
      url: '/',
      templateUrl: 'app/main/main.html'
      controller: 'MainCtrl'
    )<% } %>