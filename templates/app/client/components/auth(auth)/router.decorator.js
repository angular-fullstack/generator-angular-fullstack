'use strict';
import * as _ from 'lodash';

export function routerDecorator($rootScope<% if(filters.ngroute) { %>, $location<% } if(filters.uirouter) { %>, $state<% } %>, Auth) {
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
  $rootScope.$on(<% if(filters.ngroute) { %>'$routeChangeStart'<% } %><% if(filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {
    if(!next.authenticate) {
      return;
    }

    if(typeof next.authenticate === 'string') {
      Auth.hasRole(next.authenticate).then(has => {
        if(has) {
          return;
        }

        event.preventDefault();
        return Auth.isLoggedIn().then(is => {
          <%_ if(filters.ngroute) { _%>
          $location.path(is ? '/' : '/login');<% } %>
          <%_ if(filters.uirouter) { _%>
          $state.go(is ? 'main' : 'login');<% } %>
        });
      });
    } else {
      Auth.isLoggedIn().then(is => {
        if(is) {
          return;
        }

        event.preventDefault();
        <%_ if(filters.ngroute) { _%>
        $location.path('/login');<% } %>
        <%_ if(filters.uirouter) { _%>
        $state.go('login');<% } %>
      });
    }
  });
};
