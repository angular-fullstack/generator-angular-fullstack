import { Component } from '@angular/core';
<%_ if (filters.auth) { -%>
  <%_ if (filters.uirouter) { -%>
import { StateService } from 'ui-router-ng2';<% } %>
import { AuthService } from '../auth/auth.service';<% } %>

export let NavbarComponent = @Component({
  selector: 'navbar',
  template: require('./navbar.html')
})
class NavbarComponent {
  isCollapsed = true;
  isLoggedIn;
  isAdmin;
  currentUser = {};
  menu = [{
    title: 'Home',
    <% if(filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>,
  }];
  <%_ if(filters.auth) { -%>

  static parameters = [AuthService<% if(filters.uirouter) { %>, StateService<% } %>];
  constructor(authService: AuthService<% if(filters.uirouter) { %>, stateService: StateService<% } %>) {
    this.AuthService = authService;
    this.StateService = stateService;

    this.reset();

    this.AuthService.currentUserChanged.subscribe(user => {
      this.currentuser = user;
      this.reset();
    })
  }

  reset() {
    this.AuthService.isLoggedIn().then(is => {
      this.isLoggedIn = is;
    });
    this.AuthService.isAdmin().then(is => {
      this.isAdmin = is;
    });
    this.AuthService.getCurrentUser().then(user => {
      this.currentUser = user;
    });
  }

  logout() {
    let promise = this.AuthService.logout();
    <%_ if (filters.uirouter) { -%>
    this.StateService.go('login');<% } -%>
    <%_ if (filters.ngroute) { -%><% } -%>
    return promise;
  }<% } -%>
}
