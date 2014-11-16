'use strict';

describe('Directive: <%= cameledName %>', function () {

  // load the directive's module and view
  beforeEach(module('<%= scriptAppName %>'));
  beforeEach(module('<%= htmlUrl %>'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<<%= _.dasherize(name) %>></<%= _.dasherize(name) %>>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the <%= cameledName %> directive');
  }));
});