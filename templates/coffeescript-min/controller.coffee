'use strict'

angular.module('<%= _.camelize(appname) %>App')
  .controller '<%= _.classify(name) %>Ctrl', ['$scope', '$http', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
          $scope.awesomeThings = awesomeThings
  ]
