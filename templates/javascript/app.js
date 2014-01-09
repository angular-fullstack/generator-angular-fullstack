'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
  .config(function ($routeProvider, $locationProvider<% if (mongo && mongoPassportUser) { %>, $httpProvider<% } %>) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })<% if (mongo && mongoPassportUser) { %>
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })<% } %>
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);<% if (mongo && mongoPassportUser) { %>
    // Intercept 401s and 403s and redirect you to login
    var unauthorized = function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    };

    $httpProvider.interceptors.push(unauthorized);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });<% } %>
  })<% } %>;