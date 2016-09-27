import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HttpModule } from '@angular/http';
// import { AUTH_PROVIDERS } from 'angular2-jwt';

import { MainModule } from './main/main.ng2module';
// import { DirectivesModule } from '../components/directives.ng2module';
// <%_ if(filters.auth) { _%>
// import { AuthModule } from '../components/auth/auth.ng2module';
// import { AccountModule } from './account/account.ng2module';
// import { adminModule } from './admin/admin.ng2module';<% } %>
// import { utilModule } from '../components/util/util.ng2module';

import { upgradeAdapter } from './upgrade_adapter';

upgradeAdapter.upgradeNg1Provider('socket');

export let AppModule = @NgModule({
    // providers: [AUTH_PROVIDERS],
    imports: [
        BrowserModule,
        // HttpModule,
        MainModule,
        // DirectivesModule,
        // <%_ if(filters.auth) { _%>
        // AuthModule,
        // AccountModule,
        // adminModule,<% } %>
        // utilModule,
    ]
})
class AppModule {}
