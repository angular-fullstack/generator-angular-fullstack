'use strict';

angular.module('ngApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });