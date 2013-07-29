'use strict';

angular.module('<%= moduleName %>').config ($provide) ->
  $provide.decorator '<%= _.camelize(name) %>', ($delegate) ->
    # decorate the $delegate
    $delegate
