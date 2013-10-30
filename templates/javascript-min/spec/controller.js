'use strict';

describe('Controller: <%= _.classify(name) %>Ctrl', function () {

  // load the controller's module
  beforeEach(module('<%= _.camelize(appname) %>App'));

  var <%= _.classify(name) %>Ctrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/awesomeThings')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);    
    scope = $rootScope.$new();
    <%= _.classify(name) %>Ctrl = $controller('<%= _.classify(name) %>Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toBeUndefined();
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });
});
