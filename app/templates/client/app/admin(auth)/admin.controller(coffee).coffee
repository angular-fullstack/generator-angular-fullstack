'use strict'

angular.module '<%= scriptAppName %>'
.controller 'AdminCtrl', ($scope, $http, Auth, User) ->

  $scope.users = User.query()

  $scope.delete = (user) ->
    User.remove id: user._id
    $scope.users.splice @$index, 1
