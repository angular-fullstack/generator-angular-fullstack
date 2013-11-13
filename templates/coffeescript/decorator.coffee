'use strict'

angular.module("<%= scriptAppName").config ($provide) ->
  $provide.decorator "<%= cameledName %>", ($delegate) ->
    # decorate the $delegate
    $delegate
