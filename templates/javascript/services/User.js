'use strict';

angular.module('<%= scriptAppName %>')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id',
      {id: '@id'}, //parameters default
      {
        update: { method: 'PUT', params: {} },
			});
  });
