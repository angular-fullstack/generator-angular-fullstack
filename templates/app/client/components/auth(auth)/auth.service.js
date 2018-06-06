import { Injectable, EventEmitter, Output } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { safeCb } from '../util';
import { userRoles } from '../../app/app.constants';

// @flow
class User {
    _id = '';
    name = '';
    email = '';
    role = '';
}

@Injectable()
export class AuthService {
    _currentUser: User = new User();
    @Output() currentUserChanged = new EventEmitter(true);
    userRoles = userRoles || [];
    UserService;

    static parameters = [HttpClient, UserService];
    constructor(<%= private() %>http: HttpClient, <%= private() %>userService: UserService) {
        this.http = http;
        this.UserService = userService;

        if(localStorage.getItem('id_token')) {
            this.UserService.get().toPromise()
                .then((user: User) => {
                    this.currentUser = user;
                })
                .catch(err => {
                    console.log(err);

                    localStorage.removeItem('id_token');
                });
        }
    }

    /**
     * Check if userRole is >= role
     * @param {String} userRole - role of current user
     * @param {String} role - role to check against
     */
    static hasRole(userRole, role) {
        return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
    }

    get currentUser() {
        return this._currentUser;
    }

    set currentUser(user) {
        this._currentUser = user;
        this.currentUserChanged.emit(user);
    }

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} [callback] - function(error, user)
     * @return {Promise}
     */
    login({email, password}, callback) {
        return this.http.post('/auth/local', {
            email,
            password
        })
            .toPromise()
            .then((res: {token: string}) => {
                localStorage.setItem('id_token', res.token);
                return this.UserService.get().toPromise();
            })
            .then((user: User) => {
                this.currentUser = user;
                localStorage.setItem('user', JSON.stringify(user));
                safeCb(callback)(null, user);
                return user;
            })
            .catch(err => {
                this.logout();
                safeCb(callback)(err);
                return Promise.reject(err);
            });
    }

    /**
     * Delete access token and user info
     * @return {Promise}
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('id_token');
        this.currentUser = new User();
        return Promise.resolve();
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    createUser(user, callback) {
        return this.UserService.create(user).toPromise()
            .then(data => {
                localStorage.setItem('id_token', data.token);
                return this.UserService.get().toPromise();
            })
            .then((_user: User) => {
                this.currentUser = _user;
                return safeCb(callback)(null, _user);
            })
            .catch(err => {
                this.logout();
                safeCb(callback)(err);
                return Promise.reject(err);
            });
    }

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} [callback] - function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback) {
        return this.UserService.changePassword({id: this.currentUser._id}, oldPassword, newPassword)
            .toPromise()
            .then(() => safeCb(callback)(null))
            .catch(err => safeCb(callback)(err));
    }

    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback<% if(filters.ts) { %>?<% } %>) {
        safeCb(callback)(this.currentUser);
        return Promise.resolve(this.currentUser);
    }

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
        return this.currentUser;
    }

    /**
     * Checks if user is logged in
     * @param {function} [callback]
     * @returns {Promise}
     */
    isLoggedIn(callback<% if(filters.ts) { %>?<% } %>) {
        let is = !!this.currentUser._id;
        safeCb(callback)(is);
        return Promise.resolve(is);
    }

    /**
     * Checks if user is logged in
     * @returns {Boolean}
     */
    isLoggedInSync() {
        return !!this.currentUser._id;
    }

    /**
     * Check if a user is an admin
     *
     * @param  {Function|*} [callback] - optional, function(is)
     * @return {Promise}
     */
    isAdmin(callback<% if(filters.ts) { %>?<% } %>) {
        return this.getCurrentUser().then(user => {
            var is = user.role === 'admin';
            safeCb(callback)(is);
            return is;
        });
    }

    isAdminSync() {
        return this.currentUser.role === 'admin';
    }

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
        return localStorage.getItem('id_token');
    }
}
