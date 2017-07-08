import { Component } from '@angular/core';
<%_ if (filters.auth) { -%>
  <%_ if (filters.uirouter) { -%>
import { StateService } from 'ui-router-ng2';<% } %>
import { AuthService } from '../auth/auth.service';<% } %>

@Component({
  selector: 'navbar',
  template: require('./navbar.<%=templateExt%>')
})
export class NavbarComponent {
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
  constructor(<%= private() %>authService: AuthService<% if(filters.uirouter) { %>, <%= private() %>stateService: StateService<% } %>) {
    this.authService = authService;
    this.stateService = stateService;

    this.reset();

    this.authService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      this.reset();
    })
  }

  reset() {
    this.authService.isLoggedIn().then(is => {
      this.isLoggedIn = is;
    });
    this.authService.isAdmin().then(is => {
      this.isAdmin = is;
    });
    this.authService.getCurrentUser().then(user => {
      this.currentUser = user;
    });
  }

  logout() {
    let promise = this.authService.logout();
    <%_ if (filters.uirouter) { -%>
    this.stateService.go('login');<% } -%>
    <%_ if (filters.ngroute) { -%><% } -%>
    return promise;
  }<% } -%>
}
