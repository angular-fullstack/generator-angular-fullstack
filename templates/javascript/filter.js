'use strict';

angular.module('<%= moduleName %>')
  .filter('<%= _.camelize(name) %>', function () {
    return function (input) {
      return '<%= _.camelize(name) %> filter: ' + input;
    };
  });
