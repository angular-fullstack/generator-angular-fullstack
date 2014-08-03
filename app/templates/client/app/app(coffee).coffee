'use strict'

angular.module '<%= scriptAppName %>', [<%= angularModules %>]
<% if(filters.ngroute) { %>.config ($routeProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) ->
  $routeProvider
  .otherwise
    redirectTo: '/'

  $locationProvider.html5Mode true<% if(filters.auth) { %>
  $httpProvider.interceptors.push 'authInterceptor'<% } %>
<% } %><% if(filters.uirouter) { %>.config ($stateProvider, $urlRouterProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) ->
  $urlRouterProvider
  .otherwise '/'

  $locationProvider.html5Mode true<% if(filters.auth) { %>
  $httpProvider.interceptors.push 'authInterceptor'<% } %>
<% } %><% if(filters.auth) { %>
.factory 'authInterceptor', ($rootScope, $q, $localStorage, $sessionStorage, $location) ->
  # Add authorization token to headers
  request: (config) ->
    config.headers = config.headers or {}
    token = $localStorage.token||$sessionStorage.token
    config.headers.Authorization = 'Bearer ' + token if token
    config

  # Intercept 401s and redirect you to login
  responseError: (response) ->
    if response.status is 401
      $location.path '/login'
      # remove any stale tokens
      $cookieStore.remove 'token'

    $q.reject response

.run ($rootScope, $location, Auth) ->
  # Redirect to login if route requires auth and you're not logged in
  $rootScope.$on <% if(filters.ngroute) { %>'$routeChangeStart'<% } %><% if(filters.uirouter) { %>'$stateChangeStart'<% } %>, (event, next) ->
    Auth.isLoggedInAsync (loggedIn) ->
      $location.path "/login" if next.authenticate and not loggedIn
<% } %>