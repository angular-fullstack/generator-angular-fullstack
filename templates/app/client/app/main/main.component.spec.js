'use strict';

import main from './main.component';
import {MainController} from './main.component';

describe('Component: MainComponent', function() {

  beforeEach(angular.mock.module(main));
  <%_ if (filters.uirouter) { _%>
  beforeEach(angular.mock.module('stateMock'));<% } _%>
  <%_ if (filters.ws) { _%>
  beforeEach(angular.mock.module('socketMock'));<% } %>

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
    $state<% } %><% if (filters.ws) {%>,
    socket<% } %>) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/things')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();<% if (filters.uirouter) {%>
      state = $state;<% } %>
      mainComponent = $componentController('main', {
        $http: $http,
        $scope: scope<% if (filters.ws) {%>,
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
