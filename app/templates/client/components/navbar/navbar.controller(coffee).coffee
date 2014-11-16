'use strict'

angular.module '<%= scriptAppName %>'
.controller 'NavbarCtrl', ($scope, $location<% if(filters.auth) {%>, Auth<% } %>) ->
  $scope.menu = [
    title: 'Home'
    link: '/'
  ]
  $scope.isCollapsed = true<% if(filters.auth) {%>
  $scope.isLoggedIn = Auth.isLoggedIn
  $scope.isAdmin = Auth.isAdmin
  $scope.getCurrentUser = Auth.getCurrentUser

  $scope.logout = ->
    Auth.logout()
    $location.path '/login'<% } %>

  $scope.isActive = (route) ->
    route is $location.path()