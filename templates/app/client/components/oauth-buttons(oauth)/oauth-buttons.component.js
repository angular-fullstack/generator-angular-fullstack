import { Component } from '@angular/core';

@Component({
  selector: 'oauth-buttons',
  template: require('./oauth-buttons.<%=templateExt%>'),
  styles: [require('./oauth-buttons.<%=styleExt%>')],
})
export class OauthButtonsComponent {
  loginOauth(provider) {
    window.location.href = `/auth/${provider}`;
  };
}
