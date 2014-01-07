'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function ($scope, $location<% if(mongo && mongoPassportUser) { %>, Auth<% } %>) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'About',
      'link': '#'
    }, {
      'title': 'Contact',
      'link': '#'
    }];
    <% if(mongo && mongoPassportUser) { %>
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
