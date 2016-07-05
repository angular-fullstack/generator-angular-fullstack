'use strict';

export class NavbarComponent {
  menu = [{
    'title': 'Home',
    <% if (filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>
  }];
  <%_ if(!filters.uirouter) { -%>
  $location;
  <%_ } -%>
  <%_ if (filters.auth) { -%>
  isLoggedIn: Function;
  isAdmin: Function;
  getCurrentUser: Function;
  <%_ } -%>
  isCollapsed = true;
  <%_ if(filters.ngroute || filters.auth) { _%>

  constructor(<% if(!filters.uirouter) { %>$location<% } if(!filters.uirouter && filters.auth) { %>, <% } if (filters.auth) { %>Auth<% } %>) {
    'ngInject';
    <%_ if(!filters.uirouter) { _%>
    this.$location = $location;
    <%_ } _%>
    <%_ if (filters.auth) { _%>
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    <%_ } _%>
  }<% } %>
  <%_ if(!filters.uirouter) { _%>

  isActive(route) {
    return route === this.$location.path();
  }<% } %>
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.<%= templateExt %>'),
    controller: NavbarComponent
  })
  .name;
