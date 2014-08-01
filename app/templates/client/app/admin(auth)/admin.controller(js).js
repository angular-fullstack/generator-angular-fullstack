'use strict';

angular.module('<%= scriptAppName %>')
  .controller('AdminCtrl', function ($scope, $http, Auth, User<% if(filters.uibootstrap) { %>, Modal<% } %>) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = <% if(filters.uibootstrap) { %>Modal.confirm.delete(<% } %>function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    }<% if(filters.uibootstrap) { %>)<% } %>;
  });
