'use strict';

import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthGuard } from '../../components/auth/auth-guard.service';

@NgModule({
    providers: [
        AuthService,
        UserService,
        AuthGuard,
    ]
})
export class AuthModule {}
