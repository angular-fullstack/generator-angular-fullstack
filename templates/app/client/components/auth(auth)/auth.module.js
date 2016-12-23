'use strict';
// import {authInterceptor} from './interceptor.service';
// import {routerDecorator} from './router.decorator';

// function addInterceptor($httpProvider) {
//   $httpProvider.interceptors.push('authInterceptor');
// }

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
