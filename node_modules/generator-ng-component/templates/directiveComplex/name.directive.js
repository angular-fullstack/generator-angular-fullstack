'use strict';

angular.module('<%= scriptAppName %>')
  .directive('<%= cameledName %>', function () {
    return {
      templateUrl: '<%= htmlUrl %>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });