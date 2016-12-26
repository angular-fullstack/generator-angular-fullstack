'use strict';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

// @flow
type UserType = {
  // TODO: use Mongoose model
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  static parameters = [AuthHttp];
  constructor(authHttp: AuthHttp) {
    this.AuthHttp = authHttp;
  }

  handleError(err) {
    Observable.throw(err.json().error || 'Server error');
  }

  query(): Observable<UserType[]> {
    return this.AuthHttp.get('/api/users/')
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
  get(user = {id: 'me'}): Observable<UserType> {
    return this.AuthHttp.get(`/api/users/${user.id || user._id}`)
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
  create(user: UserType) {
    return this.AuthHttp.post('/api/users/', user)
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
  changePassword(user, oldPassword, newPassword) {
    return this.AuthHttp.put(`/api/users/${user.id || user._id}/password`, {oldPassword, newPassword})
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }
  remove(user) {
    return this.AuthHttp.delete(`/api/users/${user.id || user._id}`)
      .map(() => user)
      .catch(this.handleError);
  }
}
