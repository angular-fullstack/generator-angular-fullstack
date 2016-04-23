'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    <% if (filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(<% if(!filters.uirouter) { %>$location<% } if(!filters.uirouter && filters.auth) { %>, <% } if (filters.auth) { %>Auth<% } %>) {<% if(!filters.uirouter) { %>
    this.$location = $location;<% } %>
    <% if (filters.auth) { %>this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  <% } %>}<% if(!filters.uirouter) { %>

  isActive(route) {
    return route === this.$location.path();
  }<% } %>
}

angular.module('<%= scriptAppName %>')
  .controller('NavbarController', NavbarController);
