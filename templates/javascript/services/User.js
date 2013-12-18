'use strict';

angular.module('<%= scriptAppName %>')
  .factory('User', function ($resource) {
    return $resource('/users/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  });
