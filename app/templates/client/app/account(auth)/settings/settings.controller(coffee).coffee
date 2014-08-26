'use strict'

angular.module '<%= scriptAppName %>'
.controller 'SettingsCtrl', ($scope, Auth) ->
  $scope.errors = {}

  $scope.user = Auth.getCurrentUser()
  $scope.email = {}

  getEmail = (user) ->
    return [null, null] unless user.credentials.length

    for c in user.credentials when c.type is 'email'
      return [c.value, c.confirmed]

    [null, null]

  [initialEmail, $scope.email.confirmed] = getEmail $scope.user

  $scope.user.email = initialEmail

  $scope.changeEmail = ->
    if $scope.email.$valid
      Auth.changeEmail initialEmail, $scope.user.email
      .then ->
        $scope.message = 'Email successfully changed'

      .catch ->
        # TODO: handle errors
        $scope.message = ''

  $scope.changePassword = ->
    $scope.pwd.submitted = true

    if $scope.pwd.$valid
      Auth.changePassword $scope.user.oldPassword, $scope.user.newPassword
      .then ->
        $scope.message = 'Password successfully changed'

      .catch ->
        $scope.pwd.old.$setValidity 'mongoose', false
        $scope.errors.other = 'Incorrect password'
        $scope.message = ''
<% if (filters.oauth) { %>
  $scope.setPassword = ->
    $scope.pwd.submitted = true

    if $scope.pwd.$valid
      Auth.setPassword $scope.user.newPassword
      .then ->
        $scope.message = 'Password successfully set'
        $scope.user.localEnabled = true
        $scope.user.newPassword = ''

      .catch ->
        $scope.pwd.old.$setValidity 'mongoose', false
        $scope.errors.other = 'Another account with that email already exists'
        $scope.message = ''
<% } %>
