'use strict';

angular.module('<%= _.camelize(appname) %>App')
  .filter '<%= _.camelize(name) %>', [() ->
    (input) ->
      '<%= _.camelize(name) %> filter: ' + input
  ]
