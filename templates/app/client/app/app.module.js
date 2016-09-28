'use strict';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>
<%_ if(filters.uibootstrap) { _%>
import uiBootstrap from 'angular-ui-bootstrap';<% } %>

import constants from './app.constants';
import main from './main/main.module';
import directives from '../components/directives.module';
<%_ if(filters.auth) { _%>
import authModule from '../components/auth/auth.module';
import accountModule from './account/account.module';
import adminModule from './admin/admin.module';<% } %>
import util from '../components/util/util.module';

<%_ if(filters.socketio) { _%>
import { SocketService } from '../components/socket/socket.service';<% } %>

import {routeConfig} from './app.config';

export default angular.module('<%= scriptAppName %>', [
    ngCookies,
    ngResource,
    ngSanitize,
    <%_ if(filters.ngroute) { _%>
    ngRoute,<% } %>
    <%_ if(filters.uirouter) { _%>
    uiRouter,<% } %>
    <%_ if(filters.uibootstrap) { _%>
    uiBootstrap,<% } %>
    constants,
    main,
    directives,
    <%_ if(filters.auth) { _%>
    authModule,
    accountModule,
    adminModule,<% } %>
    util,
])
    .service('socket', SocketService)
    .config(routeConfig)
    <%_ if(filters.auth) { _%>
    .run(function($rootScope, $location, Auth) {
      'ngInject';
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function(event, next) {
        Auth.isLoggedIn(function(loggedIn) {
          if(next.authenticate && !loggedIn) {
            $location.path('/login');
          }
        });
      });
    })<% } %>
    .name;
