'use strict';
import angular from 'angular';<% if (filters.uirouter) { %>
import uiRouter from 'angular-ui-router';<% } %>
import routes from './admin.routes';
import AdminController from './admin.controller';

export default angular.module('<%= scriptAppName %>.admin', ['<%= scriptAppName %>.auth'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>, uiRouter<% } %>])
  .config(routes)
  .component('admin', {
    template: require('./admin.<%= templateExt %>'),
    controller: AdminController
  })
  .name;
