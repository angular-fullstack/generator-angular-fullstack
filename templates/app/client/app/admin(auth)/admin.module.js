import angular from 'angular';
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>

import AuthModule from '../../components/auth/auth.module';

import { AdminController } from './admin.controller';

import routing from './admin.routes';

export default angular.module('aksiteApp.admin', [
	AuthModule,
	<%_ if(filters.ngroute) { _%>ngRoute<% } %><%_ if(filters.uirouter) { _%>uiRouter<% } %>
])
    .config(routing)
    .controller('AdminController', AdminController)
    .name;
