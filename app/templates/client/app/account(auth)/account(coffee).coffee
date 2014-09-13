'use strict'

angular.module '<%= scriptAppName %>'
<% if(filters.ngroute) { %>.config ($routeProvider) ->
  $routeProvider
  .when '/login',
    templateUrl: 'app/account/login/login.html'
    controller: 'LoginCtrl'

  .when '/login/:sessionToken',
    template: ' '
    controller: ($routeParams, Auth, $location) ->
      if $routeParams.sessionToken
        Auth.setSessionToken $routeParams.sessionToken, ->
          $location.path "/"
          return
  .when '/signup',
    templateUrl: 'app/account/signup/signup.html'
    controller: 'SignupCtrl'

  .when '/settings',
    templateUrl: 'app/account/settings/settings.html'
    controller: 'SettingsCtrl'
    authenticate: true
<% } %><% if(filters.uirouter) { %>.config ($stateProvider) ->
  $stateProvider
  .state 'login',
    url: '/login'
    templateUrl: 'app/account/login/login.html'
    controller: 'LoginCtrl'

  .state 'loginWithToken',
    url: '/login/:sessionToken'
    template: ' '
    controller: ($stateParams, Auth, $location) ->
      if $stateParams.sessionToken
        Auth.setSessionToken $stateParams.sessionToken, ->
          $location.path "/"
          return      
  .state 'signup',
    url: '/signup'
    templateUrl: 'app/account/signup/signup.html'
    controller: 'SignupCtrl'

  .state 'settings',
    url: '/settings'
    templateUrl: 'app/account/settings/settings.html'
    controller: 'SettingsCtrl'
    authenticate: true
<% } %>