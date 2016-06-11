'use strict';

<%_ if (filters.ngroute) { _%>
export default function routes($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/admin', {
      template: require('./admin.<%= templateExt %>'),
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
      template: require('./admin.<%= templateExt %>'),
      controller: 'AdminController',
      controllerAs: 'admin',
      authenticate: 'admin'
    });
};<% } %>
