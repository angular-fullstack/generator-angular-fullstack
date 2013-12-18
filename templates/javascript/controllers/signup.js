'use strict';

angular.module('<%= scriptAppName %>')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.register = function(form) {
      Auth.createUser({
          email: $scope.user.email,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('/');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        }
      );
    };
  });