'use strict'

angular.module '<%= scriptAppName %>'
.controller 'SignupCtrl', ($scope, Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %><% if (filters.oauth) {%>, $window<% } %>) ->
  $scope.user = {}
  $scope.errors = {}
  $scope.register = (form) ->
    $scope.submitted = true

    if form.$valid
      # Account created, redirect to home
      Auth.createUser
        name: $scope.user.name
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        <% if (filters.ngroute) { %>$location.path '/'<% } %><% if (filters.uirouter) { %>$state.go 'main'<% } %>

      .catch (err) ->
        err = err.data
        $scope.errors = {}
<% if (filters.mongooseModels) { %>
        # Update validity of form fields that match the mongoose errors
        angular.forEach err.errors, (error, field) ->
          form[field].$setValidity 'mongoose', false
          $scope.errors[field] = error.message<% }
  if (filters.sequelizeModels) { %>
        # Update validity of form fields that match the sequelize errors
        if err.name
          angular.forEach err.fields, (field) ->
            form[field].$setValidity 'mongoose', false
            $scope.errors[field] = err.message<% } %>
<% if (filters.oauth) {%>
  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider<% } %>
