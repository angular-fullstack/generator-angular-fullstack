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
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
}

function handleError(err) {
  return Observable.throw(err.json().error || 'Server error');
}

@Injectable()
export class UserService {
  static parameters = [AuthHttp];
  constructor(<%= private() %>authHttp: AuthHttp) {
    this.authHttp = authHttp;
  }

  query(): Observable<UserType[]> {
    return this.authHttp.get('/api/users/')
      .map((res:Response) => res.json())
      .catch(handleError);
  }
  get(user: UserType = {id: 'me'}): Observable<UserType> {
    return this.authHttp.get(`/api/users/${user.id || user._id}`)
      .map((res:Response) => res.json())
      .catch(handleError);
  }
  create(user: UserType) {
    return this.authHttp.post('/api/users/', user)
      .map((res:Response) => res.json())
      .catch(handleError);
  }
  changePassword(user, oldPassword, newPassword) {
    return this.authHttp.put(`/api/users/${user.id || user._id}/password`, {oldPassword, newPassword})
      .map((res:Response) => res.json())
      .catch(handleError);
  }
  remove(user) {
    return this.authHttp.delete(`/api/users/${user.id || user._id}`)
      .map(() => user)
      .catch(handleError);
  }
}
