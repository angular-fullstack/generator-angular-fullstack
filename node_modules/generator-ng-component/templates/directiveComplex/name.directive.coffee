'use strict'

angular.module '<%= scriptAppName %>'
.directive '<%= cameledName %>', ->
  templateUrl: '<%= htmlUrl %>'
  restrict: 'EA'
  link: (scope, element, attrs) ->
