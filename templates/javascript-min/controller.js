'use strict';

angular.module('<%= moduleName %>')
  .controller('<%= _.classify(name) %>Ctrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
