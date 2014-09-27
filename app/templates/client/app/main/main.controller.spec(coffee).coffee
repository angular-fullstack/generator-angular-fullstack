'use strict'

describe 'Controller: MainCtrl', ->

  # load the controller's module
  beforeEach module '<%= scriptAppName %>' <% if(filters.uirouter) {%>
  beforeEach module 'stateMock' <% } %><% if(filters.socketio) {%>
  beforeEach module 'socketMock' <% } %>

  MainCtrl = undefined
  scope = undefined<% if(filters.uirouter) {%>
  state = undefined<% } %>
  $httpBackend = undefined

  # Initialize the controller and a mock scope
  beforeEach inject (_$httpBackend_, $controller, $rootScope<% if(filters.uirouter) {%>, $state<% } %>) ->
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('/api/things').respond [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
      'Express'
    ]
    scope = $rootScope.$new()<% if(filters.uirouter) {%>
    state = $state<% } %>
    MainCtrl = $controller 'MainCtrl',
      $scope: scope

  it 'should attach a list of things to the scope', ->
    $httpBackend.flush()<% if (filters.jasmine) { %>
    expect(scope.awesomeThings.length).toBe 4 <% } if (filters.mocha) { %>
    <%= does("scope.awesomeThings.length") %>.equal 4<% } %>
