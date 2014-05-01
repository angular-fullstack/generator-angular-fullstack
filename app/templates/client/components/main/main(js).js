'use strict';

angular.module('ngApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'components/main/main.html',
        controller: 'MainCtrl'
      });
  });