'use strict'

angular.module('<%= scriptAppName %>')
  .controller 'NavbarCtrl', ($scope, $location) ->
    $scope.menu = [
      title: 'Home'
      link: '/'
    ]

    $scope.isActive = (route) ->
      route is $location.path()