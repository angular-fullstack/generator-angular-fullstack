'use strict';
import angular from 'angular';
<%_ if (filters.ngroute) { _%>
const ngRoute = require('angular-route'); <% } %>
<%_ if (filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>

import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';
<%_ if(filters.oauth) { _%>
import oauthButtons from '../../components/oauth-buttons';<% } %>

export default angular.module('<%= scriptAppName %>.account', [
    <%_ if (filters.ngroute) { _%>
    ngRoute,<% } %>
    <%_ if (filters.uirouter) { _%>
    uiRouter,<% } %>
    login,
    settings,
    signup<% if(filters.oauth) { %>,
    oauthButtons<% } %>
])
    .config(routing)
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
