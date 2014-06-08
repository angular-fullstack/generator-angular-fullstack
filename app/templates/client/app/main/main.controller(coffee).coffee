'use strict'

angular.module('<%= scriptAppName %>').controller 'MainCtrl', ($scope, $http<% if(filters.socketio) { %>, socket<% } %>) ->
  $http.get('/api/things').success (awesomeThings) ->
    $scope.awesomeThings = awesomeThings
    <% if(filters.socketio) { %>socket.syncCollection $scope.awesomeThings, 'thing'<% } %>
<% if(filters.mongoose) { %>
  $scope.addThing = ->
    return if $scope.newThing is ''
    $http.post '/api/things',
      name: $scope.newThing

    $scope.newThing = ''

  $scope.deleteThing = (thing) ->
    $http.delete '/api/things/' + thing._id<% } %>