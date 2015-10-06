'use strict';

angular.module('<%= scriptAppName %>.admin', [
  '<%= scriptAppName %>.auth'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>,
  'ui.router'<% } %>
]);
