'use strict'

describe 'Directive: <%= cameledName %>', ->

  # load the directive's module and view
  beforeEach module '<%= scriptAppName %>'
  beforeEach module '<%= htmlUrl %>'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<<%= _.dasherize(name) %>></<%= _.dasherize(name) %>>'
    element = $compile(element) scope
    scope.$apply()
    expect(element.text()).toBe 'this is the <%= cameledName %> directive'

