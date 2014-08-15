'use strict';

angular.module('<%= scriptAppName %>')
  .controller('LoginCtrl', function ($scope, Auth<% if(filters.ngroute) { %>, $location<% } %><% if(filters.uirouter) { %>, $state<% } %><% if (filters.oauth) { %>, $window<% } %>) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          <% if(filters.ngroute) { %>$location.path('/');<% } %><% if(filters.uirouter) { %>$state.go('main');<% } %>
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
<% if(filters.oauth) {%>
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };<% } %>
  });
