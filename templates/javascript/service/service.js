'use strict';

angular.module('<%= _.camelize(appname) %>App')
  .service('<%= _.classify(name) %>', function <%= _.classify(name) %>() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
