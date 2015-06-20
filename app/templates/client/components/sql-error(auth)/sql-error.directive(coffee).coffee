'use strict'

###
Removes server error when user updates input
###
angular.module '<%= scriptAppName %>'
.directive 'sqlError', ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attrs, ngModel) ->
    element.on 'keydown', ->
      ngModel.$setValidity 'sql', true
