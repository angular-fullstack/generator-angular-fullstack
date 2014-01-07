'use strict';

angular.module('<%= scriptAppName %>')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
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
          $scope.errors = {};

          // Update validity of all form fields that match the error field
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.type;
          });

          // Error that doesn't match any fields
          $scope.errors.other = err.message;
        });
    };
  });