import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<%_ if(filters.uirouter) { %>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if(filters.ngroute) { %>
import { RouterModule, Routes } from '@angular/router';<% } %>

import { AdminComponent } from './admin.component';

<%_ if(filters.ngroute) { -%>
import { ROUTES } from './admin.routes';<% } %>
<%_ if(filters.uirouter) { -%>
import { STATES } from './admin.routes';<% } %>

@NgModule({
    imports: [
        BrowserModule,
        <%_ if(filters.ngroute) { _%>
        RouterModule.forChild(ROUTES),<% } %>
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
