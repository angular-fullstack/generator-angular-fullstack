'use strict';

angular.module('<%= moduleName %>')
  .factory('<%= _.camelize(name) %>', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
