'use strict';

angular.module('<%= scriptAppName %>.auth', [
  '<%= scriptAppName %>.constants',
  'ngCookies'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>,
  'ui.router'<% } %>
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
