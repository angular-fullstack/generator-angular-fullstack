'use strict'

angular.module '<%= scriptAppName %>'
.controller 'NavbarCtrl', ($scope<% if(!filters.uirouter) { %>, $location<% } %><% if(filters.auth) {%>, Auth<% } %>) ->
  $scope.menu = [
    title: 'Home'
    <% if(filters.uirouter) { %>state: 'main'<% } else { %>link: '/'<% } %>
  ]
  $scope.isCollapsed = true<% if(filters.auth) {%>
  $scope.isLoggedIn = Auth.isLoggedIn
  $scope.isAdmin = Auth.isAdmin
  $scope.getCurrentUser = Auth.getCurrentUser<% } %><% if(!filters.uirouter) { %>

  $scope.isActive = (route) ->
    route is $location.path()<% } %>