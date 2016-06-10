'use strict';

<%_ if (filters.ngroute) { _%>
export default function routes($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/admin', {
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminController',
      controllerAs: 'admin',
      authenticate: 'admin'
    });
};<% } %>
<%_ if (filters.uirouter) { _%>
export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminController',
      controllerAs: 'admin',
      authenticate: 'admin'
    });
};<% } %>
