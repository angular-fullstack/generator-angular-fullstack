'use strict';

<%_ if (filters.uirouter) { _%>
export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '<h2>Logging Out...</h2>',
        controller: function($state, Auth) {
          'ngInject';
          var referrer = $state.params.referrer
                        || $state.current.referrer
                        || 'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        template: '<signup></signup>'
      })
      .state('settings', {
        url: '/settings',
        template: '<settings></settings>',
        authenticate: true
      });
}<% } %>
<%_ if (filters.ngroute) { _%>
export default function routes($routeProvider) {
    'ngInject';
    $routeProvider
      .when('/login', {
        template: '<login></login>'
      })
      .when('/logout', {
        name: 'logout',
        referrer: '/',
        template: '<h2>Logging Out...</h2>',
        controller: function($location, $route, Auth) {
          var referrer = $route.current.params.referrer ||
                          $route.current.referrer ||
                          '/';
          Auth.logout();
          $location.path(referrer);
        }
      })
      .when('/signup', {
        template: '<signup></signup>'
      })
      .when('/settings', {
        template: '<settings></settings>',
        authenticate: true
      });
}<% } %>
