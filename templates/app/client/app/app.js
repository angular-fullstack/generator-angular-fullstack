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
<%_ if(filters.auth) { _%>
import 'angular-validation-match';
<% } %>

<% if (filters.i18nSupport) { %> 
import i18n from 'angular-translate';  
import i18nCookie from 'angular-translate-storage-cookie';  
import i18nLocal from 'angular-translate-storage-local';  
import i18nLoader from 'angular-translate-loader-static-files';  
<% } %> 

import {routeConfig} from './app.config';

<%_ if(filters.auth) { _%>
import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';<% } %>
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
<%_ if(filters.socketio) { _%>
import socket from '../components/socket/socket.service';<% } %>


import './app.<%= styleExt %>';

angular.module('<%= scriptAppName %>', [
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
  <%_ if(filters.auth) { %>
  _Auth,
  account,
  admin,
  'validation.match',
  <% } _%>
  navbar,
  footer,
  main,
  constants,
  <%_ if(filters.socketio) { _%>
  socket,<% } %>
  <% if (filters.i18nSupport) { %> 
    'pascalprecht.translate',<% } %>   
  util
])
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
  })<% } %>;

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['<%= scriptAppName %>'], {
      strictDi: true
    });
  });
