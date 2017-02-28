import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIRouterModule } from 'ui-router-ng2';
import { CollapseModule } from 'ng2-bootstrap';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
<%_ if(filters.oauth) { -%>
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';<% } %>

@NgModule({
  imports: [
    CommonModule,
    UIRouterModule.forChild(),
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
