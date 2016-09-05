'use strict';
// @flow
<%_ if(filters.flow) { -%>
type User = {
  name: string;
  email: string;
  password: string;
};
<%_ } -%>
<%_ if(filters.ts) { -%>
interface User {
  name: string;
  email: string;
  password: string;
}
<%_ } -%>

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {login: undefined};
  submitted = false;
  Auth;
  <%_ if(filters.ngroute) { -%>
  $location;
  <%_ } if(filters.uirouter) { -%>
  $state;<% } %>

  /*@ngInject*/
  constructor(Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %>) {
    this.Auth = Auth;
    <%_ if(filters.ngroute) { -%>
    this.$location = $location;
    <%_ } if(filters.uirouter) { -%>
    this.$state = $state;<% } %>
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        <% if (filters.ngroute) { %>this.$location.path('/');<% } %><% if (filters.uirouter) { %>this.$state.go('main');<% } %>
      })
      .catch(err => {
        this.errors.login = err.message;
      });
    }
  }
}
