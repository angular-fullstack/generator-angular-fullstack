'use strict';

angular.module('<%= grunt.util._.camelize(appname) %>App')
  .controller('<%= _.classify(name) %>Ctrl', ['$scope', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Testacular'
    ];
  }]);
