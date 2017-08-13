'use strict';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
<% if(filters.mocha && filters.expect) { %>
import { expect } from 'chai';<% } %>

import { MainComponent } from './main.component';

describe('Component: MainComponent', function() {
  let comp: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let header: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(MainComponent);

    comp = fixture.componentInstance; // MainComponent test instance

    // query for the title <h1> by CSS element selector
    header = fixture.debugElement.query(By.css('header'));
    el = header.nativeElement;
  });

  it('should have a Google+ button', () => {
    //const a = fixture.debugElement.query(By.css('i.fa-google-plus')).parent.nativeElement;
    console.log(header);
    console.log(header.nativeElement);

    fixture.detectChanges();

    //<%_ if (filters.jasmine) { -%>
    //expect(a.textContent).toContain('Connect with Google+');
    //<%_ } if (filters.mocha) { -%>
    //<%= expect() %>a.textContent<%= to() %>.contain('Connect with Google+');<%_ } -%>

  });

  //beforeEach(angular.mock.module(main));
  //<%_ if (filters.uirouter) { _%>
  //beforeEach(angular.mock.module('stateMock'));<% } _%>
  //<%_ if (filters.ws) { _%>
  //beforeEach(angular.mock.module('socketMock'));<% } %>
  //
  //var scope;
  //var mainComponent;<% if (filters.uirouter) {%>
  //var state;<% } %>
  //var $httpBackend;
  //
  //// Initialize the controller and a mock scope
  //beforeEach(inject(function(
  //  _$httpBackend_,
  //  $http,
  //  $componentController,
  //  $rootScope<% if (filters.uirouter) {%>,
  //  $state<% } %><% if (filters.ws) {%>,
  //  socket<% } %>) {
  //    $httpBackend = _$httpBackend_;
  //    $httpBackend.expectGET('/api/things')
  //      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
  //
  //    scope = $rootScope.$new();<% if (filters.uirouter) {%>
  //    state = $state;<% } %>
  //    mainComponent = $componentController('main', {
  //      $http: $http,
  //      $scope: scope<% if (filters.ws) {%>,
  //      socket: socket<% } %>
  //    });
  //}));
  //
  //it('should attach a list of things to the controller', function() {
  //  mainComponent.$onInit();
  //  $httpBackend.flush();<% if (filters.jasmine) { %>
  //  expect(mainComponent.awesomeThings.length).toBe(4);<% } if (filters.mocha) { %>
  //  <%= expect() %>mainComponent.awesomeThings.length<%= to() %>.equal(4);<% } %>
  //});
});
