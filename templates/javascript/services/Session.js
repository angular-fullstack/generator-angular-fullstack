'use strict';

angular.module('<%= scriptAppName %>')
  .factory('Session', function ($resource) {
    return $resource('/users/session/');
  });
