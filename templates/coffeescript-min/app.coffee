'use strict'

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  .config ['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'partials/main'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
    $locationProvider.html5Mode(true)
  ]
