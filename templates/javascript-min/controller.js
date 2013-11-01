'use strict';

angular.module('<%= scriptAppName %>')
  .controller('<%= classedName %>Ctrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
