'use strict'

describe 'Controller: <%= classedName %>Ctrl', ->

  # load the controller's module
  beforeEach module '<%= scriptAppName %>'
  <%= classedName %>Ctrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    <%= classedName %>Ctrl = $controller '<%= classedName %>Ctrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
