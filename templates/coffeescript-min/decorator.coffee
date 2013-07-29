'use strict';

angular.module('<%= moduleName %>').config ['$provide', ($provide) ->
  $provide.decorator '<%= _.camelize(name) %>', ($delegate) ->
    # decorate the $delegate
    $delegate
]
