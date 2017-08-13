import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';

// @flow
<%_ if(filters.flow) { -%>
type User = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
<%_ } -%>
<%_ if(filters.ts) { -%>
interface User {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
<%_ } -%>

@Component({
  selector: 'settings',
  template: require('./settings.<%=templateExt%>'),
})
export class SettingsComponent {
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {other: undefined};
  message = '';
  submitted = false;
  AuthService;

  static parameters = [AuthService];
  constructor(_AuthService_: AuthService) {
    this.AuthService = _AuthService_;
  }

  changePassword(form) {
    this.submitted = true;

    return this.AuthService.changePassword(this.user.oldPassword, this.user.newPassword)
      .then(() => {
        this.message = 'Password successfully changed.';
      })
      .catch(() => {
        // form.password.$setValidity('mongoose', false);
        this.errors.other = 'Incorrect password';
        this.message = '';
      });
  }
}
