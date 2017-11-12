import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    static parameters = [AuthService];
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    canActivate() {
        return this.authService.isLoggedIn();
    }
}
