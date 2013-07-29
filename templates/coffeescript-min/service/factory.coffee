'use strict';

angular.module('<%= moduleName %>')
  .factory '<%= _.camelize(name) %>', [() ->
    # Service logic
    # ...

    meaningOfLife = 42

    # Public API here
    {
      someMethod: () ->
        return meaningOfLife;
    }
  ]
