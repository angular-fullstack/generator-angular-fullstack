'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function (<% if(mongo && mongoPassportUser) { %>$rootScope, <% } %>$scope, $location<% if(mongo && mongoPassportUser) { %>, Auth<% } %>) {
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
    $rootScope.$watch('currentUser', function (currentUser) {
      $scope.currentUser = currentUser;
    });

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
    <% } %>
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
