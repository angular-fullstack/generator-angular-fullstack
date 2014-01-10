'use strict'

angular.module('<%= scriptAppName %>')
  .controller 'NavbarCtrl', ($scope, $location<% if (mongoPassportUser) { %>, Auth<% } %>) ->
    $scope.menu = [
      title: 'Home'
      link: '/'
    <% if(mongoPassportUser) { %>, 
      title: 'Settings'
      link: '/settings'
    <% } %>]
    <% if(mongoPassportUser) { %>
    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/login"
    <% } %>
    $scope.isActive = (route) ->
      route is $location.path()