'use strict';

angular.module("<%= _.camelize(appname) %>App").config ["$provide", ($provide) ->
  $provide.decorator "<%= _.camelize(name) %>", ($delegate) ->
    # decorate the $delegate
    $delegate
]
