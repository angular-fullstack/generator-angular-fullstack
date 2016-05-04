'use strict';

describe('Component: mainComponent', function() {

  // load the controller's module
  beforeEach(module('<%= scriptAppName %>'));<% if (filters.uirouter) {%>
  beforeEach(module('stateMock'));<% } %><% if (filters.socketio) {%>
  beforeEach(module('socketMock'));<% } %>

  var scope;
  var mainComponent;<% if (filters.uirouter) {%>
  var state;<% } %>
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    _$httpBackend_,
    $http,
    $componentController,
    $rootScope<% if (filters.uirouter) {%>,
    $state<% } %><% if (filters.socketio) {%>,
    socket<% } %>) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/things')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();<% if (filters.uirouter) {%>
      state = $state;<% } %>
      mainComponent = $componentController('main', {
        $http: $http,
        $scope: scope<% if (filters.socketio) {%>,
        socket: socket<% } %>
      });
  }));

  it('should attach a list of things to the controller', function() {
    mainComponent.$onInit();
    $httpBackend.flush();<% if (filters.jasmine) { %>
    expect(mainComponent.awesomeThings.length).toBe(4);<% } if (filters.mocha) { %>
    <%= expect() %>mainComponent.awesomeThings.length<%= to() %>.equal(4);<% } %>
  });
});
