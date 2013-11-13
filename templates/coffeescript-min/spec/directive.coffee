'use strict'

describe 'Directive: <%= cameledName %>', () ->

  # load the directive's module
  beforeEach module '<%= scriptAppName %>'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<<%= _.dasherize(name) %>></<%= _.dasherize(name) %>>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the <%= cameledName %> directive'
