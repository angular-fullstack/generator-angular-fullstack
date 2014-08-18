'use strict';

angular.module('<%= scriptAppName %>')
  .controller('AdminCtrl', function ($scope, $http, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      _.remove($scope.users, user)
    };
  });
