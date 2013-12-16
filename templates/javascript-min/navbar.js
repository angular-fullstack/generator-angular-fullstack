'use strict';

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'About',
      'link': '#'
    },
    {
      'title': 'Contact',
      'link': '#'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
