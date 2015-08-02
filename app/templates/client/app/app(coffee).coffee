'use strict'

angular.module '<%= scriptAppName %>', [<%= angularModules %>]
<% if (filters.ngroute) { %>.config ($routeProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) ->
  $routeProvider
  .otherwise
    redirectTo: '/'

  $locationProvider.html5Mode true<% if (filters.auth) { %>
  $httpProvider.interceptors.push 'authInterceptor'<% } %>
<% } %><% if (filters.uirouter) { %>.config ($stateProvider, $urlRouterProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) ->
  $urlRouterProvider
  .otherwise '/'

  $locationProvider.html5Mode true<% if (filters.auth) { %>
  $httpProvider.interceptors.push 'authInterceptor'<% } %>
<% } %><% if (filters.auth) { %>
.factory 'authInterceptor', ($rootScope, $q, $cookies<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>) ->
  <% if (filters.uirouter) { %>state = null
  <% } %># Add authorization token to headers
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = 'Bearer ' + $cookies.get 'token' if $cookies.get 'token'
    config

  # Intercept 401s and redirect you to login
  responseError: (response) ->
    if response.status is 401
      <% if (filters.ngroute) { %>$location.path '/login'<% } if (filters.uirouter) { %>(state || state = $injector.get '$state').go 'login'<% } %>
      # remove any stale tokens
      $cookies.remove 'token'

    $q.reject response

.run ($rootScope<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %>, Auth) ->
  # Redirect to login if route requires auth and you're not logged in
  $rootScope.$on <% if (filters.ngroute) { %>'$routeChangeStart'<% } %><% if (filters.uirouter) { %>'$stateChangeStart'<% } %>, (event, next) ->
    Auth.isLoggedIn (loggedIn) ->
      event.preventDefault()
      <% if (filters.ngroute) { %>$location.path '/login'<% } %><% if (filters.uirouter) { %>$state.go 'login'<% } %> if next.authenticate and not loggedIn
<% } %>
