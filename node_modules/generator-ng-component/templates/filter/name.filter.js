'use strict';

angular.module('<%= scriptAppName %>')
  .filter('<%= cameledName %>', function () {
    return function (input) {
      return '<%= cameledName %> filter: ' + input;
    };
  });
