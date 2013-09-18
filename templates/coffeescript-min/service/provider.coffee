'use strict'

angular.module('<%= _.camelize(appname) %>App')
  .provider '<%= _.camelize(name) %>', [->

    # Private variables
    salutation = 'Hello'

    # Private constructor
    class Greeter
      @greet = ->
        salutation

    # Public API for configuration
    @setSalutation = (s) ->
      salutation = s

    # Method for instantiating
    @$get = ->
      new Greeter()
  ]
