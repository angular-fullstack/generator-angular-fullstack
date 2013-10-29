'use strict';

angular.module('<%= _.camelize(appname) %>App')
  .controller('<%= _.classify(name) %>Ctrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  }]);