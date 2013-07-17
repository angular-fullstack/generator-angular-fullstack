'use strict';

describe('Controller: WeluseCtrl', function () {

  // load the controller's module
  beforeEach(module('generatorAngularApp'));

  var WeluseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WeluseCtrl = $controller('WeluseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
