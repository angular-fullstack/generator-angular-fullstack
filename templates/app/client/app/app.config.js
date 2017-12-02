'use strict';

export function routeConfig(<% if (filters.ngroute) { %>$routeProvider<% } if (filters.uirouter) { %>$urlRouterProvider<% } %>, $locationProvider<% if (filters.i18nSupport) { %>, $translateProvider<% } %>) {
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

  <% if (filters.i18nSupport) { %> 
  $translateProvider 
    .useSanitizeValueStrategy('escape') 
    .useLocalStorage() 
    .fallbackLanguage("en") 
    .determinePreferredLanguage() 
    .useStaticFilesLoader({ 
      'prefix': 'components/i18n/locale-', 
      'suffix': '.json' 
    }); 
<% } %>
}
