import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthService } from '../../components/auth/auth.service';

<%_ if(filters.uirouter) { -%>
export const STATES = [{
  name: 'login',
  url: '/login',
  component: LoginComponent,
}, {
  name: 'signup',
  url: '/signup',
  component: SignupComponent,
}, {
  name: 'settings',
  url: '/settings',
  component: SettingsComponent,
  data: {
    authenticate: true,
  },
}, {
  name: 'logout',
  url: '/logout?referrer',
  onEnter(trans, state) {
    console.log('enter');
    // var referrer = $state.params.referrer
    //               || $state.current.referrer
    //               || 'main';
    // Auth.logout();
    // $state.go(referrer);
  },
  resolve: [{
    provide: 'isLoggedIn',
    useFactory: (AuthService) => {
      console.log('resolve');
      return AuthService.isLoggedIn();
    },
    deps: [AuthService],
  }],
}];<% } %>
<%_ if(filters.ngroute) { -%><% } %>
