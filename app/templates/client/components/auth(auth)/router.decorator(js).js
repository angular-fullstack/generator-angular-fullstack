'use strict';

(function() {

  function routerDecorator(<%= filters.uirouter ? '$stateProvider' : '$provide' %>) {
    var authDecorator = function(<%= filters.uirouter ? 'state' : 'route' %>) {
      var auth = <%= filters.uirouter ? 'state' : 'route' %>.authenticate;
      if (auth) {
        <%= filters.uirouter ? 'state' : 'route' %>.resolve = <%= filters.uirouter ? 'state' : 'route' %>.resolve || {};
        <%= filters.uirouter ? 'state' : 'route' %>.resolve.user = function(<%= filters.uirouter ? '$state' : '$location' %>, $q, Auth) {
          return Auth.getCurrentUser(true)
            .then(function(user) {
              if ((typeof auth !== 'string' && user._id) ||
                (typeof auth === 'string' && Auth.hasRole(auth))) {
                return user;
              }<% if (filters.ngroute) { %>
              $location.path((user._id) ? '/' : '/login');<% } if (filters.uirouter) { %>
              $state.go((user._id) ? 'main' : 'login');<% } %>
              return $q.reject('not authorized');
            });
        };
      }
    };<% if (filters.ngroute) { %>

    $provide.decorator('$route', function($delegate) {
      for (var r in $delegate.routes) {
        authDecorator($delegate.routes[r]);
      }
      return $delegate;
    });<% } if (filters.uirouter) { %>

    $stateProvider.decorator('authenticate', function(state) {
      authDecorator(state);
      return state.authenticate;
    });<% } %>
  }

  angular.module('<%= scriptAppName %>.auth')
    .config(routerDecorator);

})();
