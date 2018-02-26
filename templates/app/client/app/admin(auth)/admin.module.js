import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';<% if(filters.uirouter) { %>
import { UIRouterModule } from 'ui-router-ng2';<% } %><% if(filters.ngroute) { %>
import { RouterModule, Routes } from '@angular/router';<% } %>
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { AuthModule } from '../../components/auth/auth.module';
import { AdminComponent } from './admin.component';

<%_ if(filters.uirouter) { -%>
import { STATES } from './admin.routes';<% } %>
<%_ if(filters.ngroute) { -%>
const adminRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
}];<% } %>

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        <%_ if(filters.ngroute) { _%>
        RouterModule.forChild(adminRoutes),<% } %>
        <%_ if(filters.uirouter) { _%>
        UIRouterModule.forChild({
            states: STATES,
        }),<% } %>
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
})
export class AdminModule {}
