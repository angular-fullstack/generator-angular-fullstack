'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function ($scope, $location<% if(filters.auth) {%>, Auth<% } %>) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;<% if(filters.auth) {%>
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };<% } %>

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });