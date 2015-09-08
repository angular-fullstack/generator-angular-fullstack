'use strict'

angular.module('<%= scriptAppName %>')
.controller 'OauthButtonsCtrl', ($window) ->
  @loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider
  return;
