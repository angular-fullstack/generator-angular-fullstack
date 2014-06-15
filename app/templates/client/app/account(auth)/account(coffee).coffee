'use strict'

angular.module('<%= scriptAppName %>')
  <% if(filters.ngroute) { %>.config ($routeProvider) ->
    $routeProvider
    .when('/login',
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginCtrl'
    )
    .when('/signup',
      templateUrl: 'app/account/signup/signup.html'
      controller: 'SignupCtrl'
    )
    .when('/settings',
      templateUrl: 'app/account/settings/settings.html'
      controller: 'SettingsCtrl'
    )<% } %><% if(filters.uirouter) { %>.config ($stateProvider) ->
    $stateProvider
    .state('login',
      url: '/login',
      templateUrl: 'app/account/login/login.html'
      controller: 'LoginCtrl'
    )
    .state('signup',
      url: '/signup',
      templateUrl: 'app/account/signup/signup.html'
      controller: 'SignupCtrl'
    )
    .state('settings',
      url: '/settings',
      templateUrl: 'app/account/settings/settings.html'
      controller: 'SettingsCtrl'
    )<% } %>