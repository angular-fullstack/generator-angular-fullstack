'use strict'

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  .config ($routeProvider, $locationProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'partials/main'
        controller: 'MainCtrl'
      <% if(mongo && mongoPassportUser) {%>
      .when '#/login',
        templateUrl: 'partials/login'
        controller: 'LoginCtrl'
      .when '#/signup', 
        templateUrl: 'partials/signup'
        controller: 'SignupCtrl'
      <% } %>
      .otherwise
        redirectTo: '/'
    $locationProvider.html5Mode(true)