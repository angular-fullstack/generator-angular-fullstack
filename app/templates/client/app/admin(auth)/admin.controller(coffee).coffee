'use strict'

angular.module '<%= scriptAppName %>'
.controller 'AdminCtrl', ($scope, $http, User<% if(filters.uibootstrap) { %>, Modal<% } %>) ->

  # Use the User $resource to fetch all users
  $scope.users = User.query()

  $scope.delete = <% if(filters.uibootstrap) { %>Modal.confirm.delete <% } %>(user) ->
    User.remove id: user._id
    _.remove $scope.users, user