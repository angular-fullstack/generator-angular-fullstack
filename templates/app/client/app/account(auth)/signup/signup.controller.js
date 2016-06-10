'use strict';

export default class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  /*@ngInject*/
  constructor(Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %>) {
    this.Auth = Auth;<% if (filters.ngroute) { %>
    this.$location = $location;<% } if (filters.uirouter) { %>
    this.$state = $state;<% } %>
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        <% if (filters.ngroute) { %>this.$location.path('/');<% } %><% if (filters.uirouter) { %>this.$state.go('main');<% } %>
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
<% if (filters.mongooseModels) { %>
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });<% }
if (filters.sequelizeModels) { %>
        // Update validity of form fields that match the sequelize errors
        if (err.name) {
          angular.forEach(err.fields, field => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = err.message;
          });
        }<% } %>
      });
    }
  }
}
