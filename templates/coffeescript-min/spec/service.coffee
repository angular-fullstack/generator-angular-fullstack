'use strict'

describe 'Service: <%= classedName %>', () ->

  # load the service's module
  beforeEach module '<%= scriptAppName %>App'

  # instantiate service
  <%= classedName %> = {}
  beforeEach inject (_<%= classedName %>_) ->
    <%= classedName %> = _<%= classedName %>_

  it 'should do something', () ->
    expect(!!<%= classedName %>).toBe true
