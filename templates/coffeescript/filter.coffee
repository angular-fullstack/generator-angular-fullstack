'use strict'

angular.module('<%= scriptAppName %>')
  .filter '<%= cameledName %>', () ->
    (input) ->
      '<%= cameledName %> filter: ' + input
