'use strict';

angular.module('<%= scriptAppName %>.auth', [
  'ngCookies'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>,
  'ui.router'<% } %>
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
