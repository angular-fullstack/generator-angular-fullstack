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

export default class SignupController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
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

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        <% if(filters.ngroute) { %>this.$location.path('/');<% } -%>
        <% if(filters.uirouter) { %>this.$state.go('main');<% } -%>
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
        <%_ if(filters.mongooseModels) { -%>
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });<% } %>
        <%_ if(filters.sequelizeModels) { -%>
        // Update validity of form fields that match the sequelize errors
        if(err.name) {
          angular.forEach(err.fields, field => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = err.message;
          });
        }<% } %>
      });
    }
  }
}
