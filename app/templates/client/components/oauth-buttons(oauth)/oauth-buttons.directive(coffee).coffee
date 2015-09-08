'use strict'

angular.module('<%= scriptAppName %>')
.directive 'oauthButtons', ->
  templateUrl: 'components/oauth-buttons/oauth-buttons.html'
  restrict: 'EA'
  controller: 'OauthButtonsCtrl'
  controllerAs: 'OauthButtons'
  scope: classes: '@'
