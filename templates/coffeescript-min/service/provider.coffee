'use strict'

angular.module('<%= moduleName %>')
  .provider '<%= _.camelize(name) %>', [() ->

    # Private variables
    salutation = 'Hello'

    # Private constructor
    Greeter () ->
      this.greet = () {
        salutation

    # Public API for configuration
    this.setSalutation = (s) ->
      salutation = s

    # Method for instantiating
    this.$get = () ->
      new Greeter()
  ]
