'use strict';

angular.module('<%= scriptAppName %>')
  .controller('SettingsCtrl', function ($scope, Auth) {
    $scope.errors = {};

    $scope.user = Auth.getCurrentUser();
    $scope.email = {};

    var getEmail = function(user) {
      if (!$scope.user.credentials.length) {
        return null;
      }

      for(var i in $scope.user.credentials) {
        var c = $scope.user.credentials[i];
        if(c.type==='email') return [c.value, c.confirmed];
      }
    };

    var tmp = getEmail($scope.user);

    var initialEmail = tmp ? tmp[0] : null;
    $scope.email.confirmed = tmp ? tmp[1] : null;

    $scope.user.email = initialEmail;

    $scope.changeEmail = function () {
      if($scope.email.$valid) {
        Auth.changeEmail(initialEmail, $scope.user.email)
        .then(function() {
          $scope.message = 'Email successfully changed';
        })
        .catch(function() {
          // TODO: handle errors
          $scope.message = '';
        });
      }
    }

    $scope.changePassword = function() {
      $scope.pwd.submitted = true;
      if($scope.pwd.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed';
        })
        .catch( function() {
          $scope.pwd.old.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
<% if (filters.oauth) { %>
    $scope.setPassword = function() {
      $scope.submitted = true;
      if($scope.pwd.$valid) {
        Auth.changePassword( $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully set';
        })
        .catch( function() {
          $scope.pwd.old.$setValidity('mongoose', false);
          $scope.errors.other = 'Another account with that email already exists';
          $scope.message = '';
        });
      }
    };
<% } %>
  });
