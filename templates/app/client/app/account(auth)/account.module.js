import angular from 'angular';
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>

import AuthModule from '../../components/auth/auth.module';
<%_ if(filters.oauth) { _%>
import oauthButtons from '../../components/oauth-buttons';<% } %>

import { LoginController } from './login/login.controller';
import { SettingsController } from './settings/settings.controller';
import { SignupController } from './signup/signup.controller';

import routing from './account.routes';

export default angular.module('aksiteApp.account', [
	AuthModule,
	<%_ if(filters.ngroute) { _%>ngRoute<% } %><%_ if(filters.uirouter) { _%>uiRouter<% } %>,
	oauthButtons,
])
    .config(routing)
    .component('login', {
      template: require('./login/login.<%= templateExt %>'),
      controller: LoginController
    })
    .component('settings', {
      template: require('./settings/settings.<%= templateExt %>'),
      controller: SettingsController
    })
    .component('signup', {
      template: require('./signup/signup.<%= templateExt %>'),
      controller: SignupController
    })
    <%_ if (filters.ngroute) { _%>
    .run(function($rootScope) {
      'ngInject';
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
          next.referrer = current.originalPath;
        }
      });
    })<% } %>
    <%_ if (filters.uirouter) { _%>
    .run(function($rootScope) {
      'ngInject';
      $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
        if (next.name === 'logout' && current && current.name && !current.authenticate) {
          next.referrer = current.name;
        }
      });
    })<% } %>
    .name;
