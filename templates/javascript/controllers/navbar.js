'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function ($scope, $location<% if(mongoPassportUser) { %>, Auth<% } %>) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }<% if(mongoPassportUser) { %>, {
      'title': 'Settings',
      'link': '/settings'
    }<% } %>];
    <% if(mongoPassportUser) { %>
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    <% } %>
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
