// @flow
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

type UserType = {
    // TODO: use Mongoose model
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
};

@Injectable()
export class UserService {
    static parameters = [HttpClient];
    constructor(<%= private() %>http: HttpClient) {
        this.http = http;
    }

    query(): Observable<UserType[]> {
        return this.http.get('/api/users/');
    }
    get(user<% if(filters.ts) { %>: UserType<% } %> = {id: 'me'}): Observable<UserType> {
        return this.http.get(`/api/users/${user.id || user._id}`);
    }
    create(user: UserType) {
        return this.http.post('/api/users/', user);
    }
    changePassword(user, oldPassword, newPassword) {
        return this.http.put(`/api/users/${user.id || user._id}/password`, {oldPassword, newPassword});
    }
    remove(user) {
        return this.http.delete(`/api/users/${user.id || user._id}`)
            .map(() => user);
    }
}
