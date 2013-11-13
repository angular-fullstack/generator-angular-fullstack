'use strict'

angular.module('<%= scriptAppName %>')
  .controller '<%= classedName %>Ctrl', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings