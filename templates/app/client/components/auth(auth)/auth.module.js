'use strict';

import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@NgModule({
    providers: [
        AuthService,
        UserService
    ]
})
export class AuthModule {}
