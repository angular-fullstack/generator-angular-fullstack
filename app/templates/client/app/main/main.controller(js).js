'use strict';

angular.module('<%= scriptAppName %>')
  .controller('MainCtrl', function($scope, $http<% if (filters.socketio) { %>, socket<% } %>) {
    $scope.awesomeThings = [];

    $http.get('/api/things').then(function(response) {
      $scope.awesomeThings = response.data;<% if (filters.socketio) { %>
      socket.syncUpdates('thing', $scope.awesomeThings);<% } %>
    });
<% if (filters.models) { %>
    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };<% } %><% if (filters.socketio) { %>

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });<% } %>
  });
