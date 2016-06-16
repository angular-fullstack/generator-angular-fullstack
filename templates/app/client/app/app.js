'use strict';
import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
<%_ if(filters.socketio) { _%>
import 'angular-socket-io';<% } %>
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>
<%_ if(filters.uibootstrap) { _%>
import uiBootstrap from 'angular-ui-bootstrap';<% } %>
// import ngMessages from 'angular-messages';
<%_ if(filters.auth) { _%>
//import ngValidationMatch from 'angular-validation-match';<% } %>


import {routeConfig} from './app.config';

<%_ if(filters.auth) { _%>
import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';<% } %>
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import './app.constant';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';


import './app.<%= styleExt %>';

angular.module('<%= scriptAppName %>', [
  // ngAnimate,
  ngCookies,
  ngResource,
  ngSanitize,
  <%_ if(filters.socketio) { %>
  'btford.socket-io',<% } %>
  <%_ if(filters.ngroute) { %>
  ngRoute,<% } _%>
  <%_ if(filters.uirouter) { %>
  uiRouter,<% } _%>
  <%_ if(filters.uibootstrap) { %>
  uiBootstrap,<% } %>
  // ngMessages,
  <%_ if(filters.auth) { %>
  // ngValidationMatch,
  _Auth,
  account,
  admin,<% } _%>
  navbar,
  footer,
  main,
  '<%= scriptAppName %>.constants',
  socket,
  util
])
  .config(routeConfig)
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
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['<%= scriptAppName %>'], {
      strictDi: true
    });
  });
