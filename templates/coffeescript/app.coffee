'use strict'

angular.module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
  .config ($routeProvider, $locationProvider<% if (mongoPassportUser) { %>, $httpProvider<% } %>) ->
    $routeProvider
      .when '/',
        templateUrl: 'partials/main'
        controller: 'MainCtrl'
      <% if(mongoPassportUser) {%>
      .when '/login',
        templateUrl: 'partials/login'
        controller: 'LoginCtrl'
      .when '/signup', 
        templateUrl: 'partials/signup'
        controller: 'SignupCtrl'
      .when '/settings',
        templateUrl: 'partials/settings'
        controller: 'SettingsCtrl'
        authenticate: true<% } %>
      .otherwise
        redirectTo: '/'

    $locationProvider.html5Mode true<% if (mongoPassportUser) { %>
  
    # Intercept 401s and redirect you to login
    $httpProvider.interceptors.push ['$q', '$location', ($q, $location) ->
      responseError: (response) ->
        if response.status is 401
          $location.path '/login'
          $q.reject response
        else
          $q.reject response
    ]
  .run ($rootScope, $location, Auth) ->
    
    # Redirect to login if route requires auth and you're not logged in
    $rootScope.$on '$routeChangeStart', (event, next) ->
      $location.path '/login'  if next.authenticate and not Auth.isLoggedIn()<% } %><% } %>