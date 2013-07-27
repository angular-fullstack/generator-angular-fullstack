'use strict'

angular.module('<%= moduleName %>')
  .controller '<%= _.classify(name) %>Ctrl', ['$scope', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
  ]
