'use strict';

// Declare app level module which depends on filters, and services
var <%= grunt.util._.camelize(appname) %>App = angular.module('<%= grunt.util._.camelize(appname) %>App', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
