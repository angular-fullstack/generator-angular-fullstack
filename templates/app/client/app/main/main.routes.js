'use strict';

<%_ if(filters.ngroute) { _%>
export default function routes($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/', {
      template: '<main></main>'
    });
};<% } %>
<%_ if(filters.uirouter) { _%>
export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>'
    });
};<% } %>
