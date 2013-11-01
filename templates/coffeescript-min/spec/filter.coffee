'use strict'

describe 'Filter: <%= cameledName %>', () ->

  # load the filter's module
  beforeEach module '<%= scriptAppName %>'

  # initialize a new instance of the filter before each test
  <%= cameledName %> = {}
  beforeEach inject ($filter) ->
    <%= cameledName %> = $filter '<%= cameledName %>'

  it 'should return the input prefixed with "<%= cameledName %> filter:"', () ->
    text = 'angularjs'
    expect(<%= cameledName %> text).toBe ('<%= cameledName %> filter: ' + text)
