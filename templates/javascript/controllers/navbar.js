'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'About',
      'link': '#'
    }, {
      'title': 'Contact',
      'link': '#'
    }<% if(mongo && mongoPassportUser) { %>, {
      'title': 'Sign Up',
      'link': '#/signup'
    }, {
      'title': 'Login',
      'link': '#/login'
    }<% } %>];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
