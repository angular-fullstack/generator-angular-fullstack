'use strict';

angular.module('<%= scriptAppName %>')
  .controller('MainCtrl', function ($scope, $http<% if(filters.socketio) { %>, socket<% } %>) {
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;<% if(filters.socketio) { %>
      socket.syncCollection($scope.awesomeThings, 'thing');<% } %>
    });
<% if(filters.mongoose) { %>
    $scope.addThing = function() {
      if($scope.newThing === '') return;
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });<% } %>