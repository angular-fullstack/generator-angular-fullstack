'use strict'

describe 'Service: <%= _.classify(name) %>', () ->

  # load the service's module
  beforeEach module '<%= _.classify(appname) %>App'

  # instantiate service
  <%= _.classify(name) %> = {}
  beforeEach inject (_<%= _.classify(name) %>_) ->
    <%= _.classify(name) %> = _<%= _.classify(name) %>_

  it 'should do something', () ->
    expect(!!<%= _.classify(name) %>).toBe true
