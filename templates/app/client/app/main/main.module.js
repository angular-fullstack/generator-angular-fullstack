import angular from 'angular';
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>
import { upgradeAdapter } from '../upgrade_adapter';

import { MainComponent } from './main.component';

import routing from './main.routes';

export default angular.module('aksiteApp.main', [<%_ if(filters.ngroute) { _%>ngRoute<% } %><%_ if(filters.uirouter) { _%>uiRouter<% } %>])
    .config(routing)
    .directive('main', upgradeAdapter.downgradeNg2Component(MainComponent))
    .name;
