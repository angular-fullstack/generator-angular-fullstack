'use strict';

angular.module('<%= moduleName %>')
  .filter '<%= _.camelize(name) %>', [() ->
    (input) ->
      '<%= _.camelize(name) %> filter: ' + input
  ]
