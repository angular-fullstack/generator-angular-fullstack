'use strict'

angular.module('<%= scriptAppName %>').controller 'MainCtrl', ($scope, $http, socket) ->
  $http.get('/api/things').success (awesomeThings) ->
    $scope.awesomeThings = awesomeThings
    socket.syncCollection $scope.awesomeThings, 'thing'

  $scope.addThing = ->
    return if $scope.newThing is ''
    $http.post '/api/things',
      name: $scope.newThing

    $scope.newThing = ''

  $scope.deleteThing = (thing) ->
    $http.delete '/api/things/' + thing._id