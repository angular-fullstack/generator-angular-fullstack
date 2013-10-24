'use strict'

angular.module("<%= scriptAppName").config ["$provide", ($provide) ->
  $provide.decorator "<%= cameledName %>", ($delegate) ->
    # decorate the $delegate
    $delegate
]
