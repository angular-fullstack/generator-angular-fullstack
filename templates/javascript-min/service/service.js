'use strict';

angular.module('<%= moduleName %>')
  .service('<%= _.classify(name) %>', function <%= _.classify(name) %>() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
