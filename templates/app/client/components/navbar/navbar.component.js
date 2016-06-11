'use strict';

export class NavbarComponent {
  //start-non-standard
  menu = [{
    'title': 'Home',
    <% if (filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>
  }];
  
  isCollapsed = true;
  //end-non-standard
  <%_ if(filters.ngroute || filters.auth) { _%>

  constructor(<% if(!filters.uirouter) { %>$location<% } if(!filters.uirouter && filters.auth) { %>, <% } if (filters.auth) { %>Auth<% } %>) {
    'ngInject';
    <%_ if(!filters.uirouter) { _%>
    this.$location = $location;
    <%_ } _%>
    <%_ if (filters.auth) { _%>
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
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
