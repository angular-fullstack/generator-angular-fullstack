'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('<%= scriptAppName %>')
  .directive('postgresError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('postgres', true);
        });
      }
    };
  });
