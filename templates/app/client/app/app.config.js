'use strict';

export function routeConfig(<% if (filters.ngroute) { %>$routeProvider<% } if (filters.uirouter) { %>$urlRouterProvider<% } %>, $locationProvider) {
  'ngInject';
  <%_ if(filters.ngroute) { _%>
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });<% } %>
  <%_ if(filters.uirouter) { _%>
  $urlRouterProvider
    .otherwise('/');<% } %>

  $locationProvider.html5Mode(true);
}
