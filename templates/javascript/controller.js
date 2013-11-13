'use strict';

angular.module('<%= scriptAppName %>')
  .controller('<%= classedName %>Ctrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
