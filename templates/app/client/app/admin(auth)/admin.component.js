'use strict';
import angular from 'angular';<% if (filters.uirouter) { %>
import uiRouter from 'angular-ui-router';<% } %>
import routes from './admin.routes';

export class AdminController {
  <%_ if(filters.ts || filters.flow) { _%>
  users: Object[];

  <%_ } _%>
  /*@ngInject*/
  constructor(User) {
    this.User = User;
  }

  $onInit() {
    this.users = this.User.query(); // Fetch all users
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

export default angular.module('<%= scriptAppName %>.admin', ['<%= scriptAppName %>.auth'<% if (filters.ngroute) { %>,
  'ngRoute'<% } if (filters.uirouter) { %>, uiRouter<% } %>])
  .config(routes)
  .component('admin', {
    template: require('./admin.<%= templateExt %>'),
    controller: AdminController
  })
  .name;
