'use strict';

angular.module('<%= scriptAppName %>.auth', [
  '<%= scriptAppName %>.constants',
  '<%= scriptAppName %>.util',
  'ngCookies'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>,
  'ui.router'<% } %>
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
