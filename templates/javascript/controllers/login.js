'use strict';

angular.module('<%= scriptAppName %>')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login('local', {
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(user) {
          // Success, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          var err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });