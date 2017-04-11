import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
<%_ if (filters.uirouter) { -%>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%><% } %>
<%_ if(filters.oauth) { -%>
import { DirectivesModule } from '../../components/directives.module';<% } %>

import { STATES } from './account.routes';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        <%_ if (filters.uirouter) { -%>
        UIRouterModule.forChild({
            states: STATES,
        }),<% } %>
        <%_ if (filters.ngroute) { -%><% } %>
        <%_ if(filters.oauth) { -%>
        DirectivesModule,<% } %>
    ],
    declarations: [
        LoginComponent,
        SignupComponent,
        SettingsComponent,
    ],
})
export class AccountModule {}
