'use strict'

angular.module '<%= scriptAppName %>'
.directive 'navbar', ->
  templateUrl: 'components/navbar/navbar.html'
  restrict: 'E'
  controller: 'NavbarCtrl'
