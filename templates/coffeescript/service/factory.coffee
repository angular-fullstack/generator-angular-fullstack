'use strict'

angular.module('<%= scriptAppName %>')
  .factory '<%= cameledName %>', () ->
    # Service logic
    # ...

    meaningOfLife = 42

    # Public API here
    {
      someMethod: () ->
        meaningOfLife
    }
