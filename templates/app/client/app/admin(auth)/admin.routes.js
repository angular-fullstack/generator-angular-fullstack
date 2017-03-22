'use strict';

<%_ if (filters.ngroute) { _%>
export default function routes($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/admin', {
      template: '<admin></admin>',
      authenticate: 'admin'
    });
};<% } %>
<%_ if (filters.uirouter) { _%>
export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/admin',
      template: '<admin></admin>',
      authenticate: 'admin'
    });
};<% } %>
