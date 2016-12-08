// @flow
import { Component } from '@angular/core';
<%_ if(filters.uirouter) { -%>
import { StateService } from 'ui-router-ng2';<% } %>
<%_ if(filters.ngroute) { -%><% } %>
import { AuthService } from '../../../components/auth/auth.service';
import {ANGULARCLASS_MATCH_CONTROL_DIRECTIVES} from '@angularclass/match-control';

<%_ if(filters.flow) { -%>
type User = {
  name: string;
  email: string;
  password: string;
};<% } %>
<%_ if(filters.ts) { -%>
interface User {
  name: string;
  email: string;
  password: string;
}<% } %>

export let SignupComponent = @Component({
  selector: 'signup',
  template: require('./signup.<%=templateExt%>'),
  directives: [...ANGULARCLASS_MATCH_CONTROL_DIRECTIVES]
})
class SignupComponent {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
  submitted = false;
  AuthService;
  <%_ if(filters.ngroute) { -%><% } %>
  <%_ if(filters.uirouter) { -%>
  StateService;<% } %>

  static parameters = [AuthService, <% if(filters.ngroute) { %><% } else { %>StateService<% } %>];
  constructor(_AuthService_: AuthService, <% if(filters.ngroute) { %><% } else { %>_StateService_: StateService<% } %>) {
    this.AuthService = _AuthService_;
    <%_ if(filters.ngroute) { -%><% } -%>
    <%_ if(filters.uirouter) { -%>
    this.StateService = _StateService_;<% } -%>
  }

  register(form) {
    this.submitted = true;

    return this.AuthService.createUser({
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    })
    .then(() => {
      // Account created, redirect to home
      <% if(filters.ngroute) { %>this.$location.path('/');<% } -%>
      <% if(filters.uirouter) { %>this.StateService.go('main');<% } -%>
    })
    .catch(err => {
      err = err.data;
      this.errors = {};
      <%_ if(filters.mongooseModels) { -%>
      // Update validity of form fields that match the mongoose errors
      err.errors.forEach((error, field) => {
        // form[field].$setValidity('mongoose', false);
        this.errors[field] = error.message;
      });<% } %>
      <%_ if(filters.sequelizeModels) { -%>
      // Update validity of form fields that match the sequelize errors
      if(err.name) {
        err.fields.forEach(field => {
          // form[field].$setValidity('mongoose', false);
          this.errors[field] = err.message;
        });
      }<% } %>
    });
  }
}
