import { Component } from '@angular/core';
<%_ if (filters.auth) { -%>
<%_ if (filters.uirouter) { -%>
import { StateService } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%>
import { Router } from '@angular/router';<% } %>
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
    <% if(filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/home'<% } %>,
  }];
  <%_ if(filters.auth) { -%>

  static parameters = [AuthService<% if(filters.uirouter) { %>, StateService<% } else { %>, Router<% } %>];
  constructor(<%= private() %>authService: AuthService<% if(filters.uirouter) { %>, <%= private() %>stateService: StateService<% } else { %>, <%= private() %>router: Router<% } %>) {
    this.AuthService = authService;
    <%_ if(filters.uirouter) { -%>
    this.StateService = stateService;<% } %>
    <%_ if(filters.ngroute) { -%>
    this.Router = router;<% } %>

    this.reset();

    this.AuthService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      this.reset();
    });
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
    <%_ if(filters.uirouter) { -%>
    this.StateService.go('login');<% } -%>
    <%_ if(filters.ngroute) { -%>
    this.Router.navigateByUrl('/home');<% } -%>
    return promise;
  }<% } -%>
}
