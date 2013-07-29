'use strict';

angular.module('<%= moduleName %>')
  .controller('<%= _.classify(name) %>Ctrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
