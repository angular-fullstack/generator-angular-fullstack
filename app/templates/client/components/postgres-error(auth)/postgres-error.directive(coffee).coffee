'use strict'

###
Removes server error when user updates input
###
angular.module '<%= scriptAppName %>'
.directive 'postgresError', ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attrs, ngModel) ->
    element.on 'keydown', ->
      ngModel.$setValidity 'postgres', true
