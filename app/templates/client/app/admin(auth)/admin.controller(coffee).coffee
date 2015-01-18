'use strict'

angular.module '<%= scriptAppName %>'
.controller 'AdminCtrl', ($scope, $http, Auth, User) ->

  $http.get '/api/v1/users'
  .success (users) ->
    $scope.users = users

  $scope.delete = (user) ->
    User.remove id: user._id
    _.remove $scope.users, user
