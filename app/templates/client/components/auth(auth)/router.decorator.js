'use strict';

(function() {

angular.module('<%= scriptAppName %>.auth')
  .run(function($rootScope<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $state<% } %>, Auth) {    
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on(<% if (filters.ngroute) { %>'$routeChangeStart'<% } %><% if (filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {    
      if(!next.authenticate) {
        return;
      }

      let query = typeof next.authenticate === 'string' ? Auth.hasRole : Auth.isLoggedIn;

      query(1,2).then(good => {
        if(!good) {
          event.preventDefault();
          Auth.isLoggedIn().then(is => {<% if (filters.ngroute) { %>
            $location.path(is ? '/' : '/login');<% } if (filters.uirouter) { %>
            $state.go(is ? 'main' : 'login');<% } %>
          });
        }
      });
    });    
  });

})();
