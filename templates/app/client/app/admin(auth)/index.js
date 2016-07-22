'use strict';
import routes from './admin.routes';
import AdminController from './admin.controller';

export default angular.module('<%= scriptAppName %>.admin', [
  '<%= scriptAppName %>.auth'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>,
  'ui.router'<% } %>
])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
