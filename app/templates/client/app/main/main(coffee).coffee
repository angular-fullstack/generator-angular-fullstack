'use strict'

angular.module('<%= scriptAppName %>').config ($routeProvider) ->
  $routeProvider.when '/',
    templateUrl: 'app/main/main.html'
    controller: 'MainCtrl'