import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<%_ if (filters.uirouter) { -%>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%>
import { RouterModule, Routes } from '@angular/router';<% } %>
import { CollapseModule } from 'ng2-bootstrap';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
<%_ if(filters.oauth) { -%>
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';<% } %>

@NgModule({
  imports: [
    CommonModule,
    <%_ if (filters.uirouter) { -%>
    UIRouterModule.forChild(),<% } %>
    <%_ if (filters.ngroute) { -%>
    RouterModule.forChild(),<% } %>
    CollapseModule,
    AuthModule,
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    <%_ if(filters.oauth) { -%>
    OauthButtonsComponent,<% } %>
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    <%_ if(filters.oauth) { -%>
    OauthButtonsComponent,<% } %>
  ]
})
export class DirectivesModule {}
