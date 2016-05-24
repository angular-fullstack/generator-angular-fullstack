'use strict';

class LoginController {
  constructor(Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %>) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;<% if (filters.ngroute) { %>
    this.$location = $location;<% } if (filters.uirouter) { %>
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
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('<%= scriptAppName %>')
  .controller('LoginController', LoginController);
