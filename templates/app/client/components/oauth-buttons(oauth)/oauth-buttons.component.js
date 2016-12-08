import { Component } from '@angular/core';

export let OauthButtonsComponent = @Component({
  selector: 'oauth-buttons',
  template: require('./oauth-buttons.<%=templateExt%>'),
  styles: [require('./oauth-buttons.<%=styleExt%>')],
})
class OauthButtonsComponent {
  loginOauth(provider) {
    window.location.href = `/auth/${provider}`;
  };
}
