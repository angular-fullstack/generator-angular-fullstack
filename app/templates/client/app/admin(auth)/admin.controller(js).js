'use strict';

angular.module('<%= scriptAppName %>')
  .controller('AdminCtrl', function ($scope, $http, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.confirm = function(user) {
      User.confirm({ id:user._id }, null);
    };
  });
