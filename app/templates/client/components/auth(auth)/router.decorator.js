'use strict';

(function() {

angular.module('<%= scriptAppName %>.auth')
  .run(function($rootScope<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $state<% } %>, Auth) {    
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on(<% if (filters.ngroute) { %>'$routeChangeStart'<% } %><% if (filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {    
      if(!next.authenticate) {
        return;
      }

      if(typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(has => {
          if(has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn().then(is => {<% if (filters.ngroute) { %>
            $location.path(is ? '/' : '/login');<% } if (filters.uirouter) { %>
            $state.go(is ? 'main' : 'login');<% } %>
          });
        });
      } else {
        Auth.isLoggedIn(_.noop).then(is => {
          if(is) {
            return;
          }

          event.preventDefault();<% if (filters.ngroute) { %>
          $location.path('/');<% } if (filters.uirouter) { %>
          $state.go('main');<% } %>
        });
      }
    });    
  });

})();
