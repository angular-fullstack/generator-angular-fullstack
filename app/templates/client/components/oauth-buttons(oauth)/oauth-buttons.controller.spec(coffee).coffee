'use strict'

describe 'Controller: OauthButtonsCtrl', ->
  # load the controller's module
  beforeEach module('<%= scriptAppName %>')

  OauthButtonsCtrl = null
  $window = null

  # Initialize the controller and a mock $window
  beforeEach inject ($controller) ->
    $window = location: {}
    OauthButtonsCtrl = $controller 'OauthButtonsCtrl', $window: $window
    return

  it 'should attach loginOauth', -><% if (filters.jasmine) { %>
    expect(OauthButtonsCtrl.loginOauth).toEqual jasmine.any Function<% } if (filters.mocha) { %>
    <%= expect() %>OauthButtonsCtrl.loginOauth<%= to() %>.be.a 'function' <% } %>
    return
  return
