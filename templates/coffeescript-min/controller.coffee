'use strict'

angular.module('<%= grunt.util._.camelize(appname) %>App')
  .controller ['$scope', '<%= _.classify(name) %>Ctrl', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Testacular'
    ]
  ]
