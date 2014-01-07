'use strict';

angular.module('<%= scriptAppName %>')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      Auth.createUser({
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
        });
    };
  });