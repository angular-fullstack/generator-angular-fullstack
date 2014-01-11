'use strict'

angular.module('<%= scriptAppName %>')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
