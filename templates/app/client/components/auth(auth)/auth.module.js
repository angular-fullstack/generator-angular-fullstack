'use strict';
import angular from 'angular';
// import constants from '../../app/app.constant';
import util from '../util/util.module';
import ngCookies from 'angular-cookies';
import {authInterceptor} from './interceptor.service';
import {routerDecorator} from './router.decorator';
import {AuthService} from './auth.service';
import {UserResource} from './user.service';
<%_ if (filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if (filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>

function addInterceptor($httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('<%= scriptAppName %>.auth', [
  '<%= scriptAppName %>.constants',
  util,
  ngCookies<% if(filters.ngroute) { %>,
  ngRoute<% } if(filters.uirouter) { %>,
  uiRouter<% } %>
])
  .factory('authInterceptor', authInterceptor)
  .run(routerDecorator)
  .factory('Auth', AuthService)
  .factory('User', UserResource)
  .config(['$httpProvider', addInterceptor])
  .name;
