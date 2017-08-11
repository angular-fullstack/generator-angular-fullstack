import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
<%_ if (filters.uirouter) { -%>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%>
import { RouterModule, Routes } from '@angular/router';<% } %>
<%_ if(filters.oauth) { -%>
import { DirectivesModule } from '../../components/directives.module';<% } %>

import { STATES } from './account.routes';

import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';

<%_ if (filters.ngroute) { -%>
const accountRoutes: Routes = [{
  path: 'login',
  component: LoginComponent,
  //data: { title: 'Home' }
}, {
  path: 'settings',
  component: SettingsComponent,
}, {
  path: 'signup',
  component: SignupComponent,
}];<% } %>

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        <%_ if (filters.uirouter) { -%>
        UIRouterModule.forChild({
            states: STATES,
        }),<% } %>
        <%_ if (filters.ngroute) { -%>
        RouterModule.forChild(accountRoutes),<% } %>
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
