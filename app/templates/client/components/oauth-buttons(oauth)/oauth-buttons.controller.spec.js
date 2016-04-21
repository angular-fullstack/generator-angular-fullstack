'use strict';

describe('Controller: OauthButtonsCtrl', function() {

  // load the controller's module
  beforeEach(module('<%= scriptAppName %>'));

  var OauthButtonsCtrl, $window;

  // Initialize the controller and a mock $window
  beforeEach(inject(function($controller) {
    $window = {
      location: {}
    };

    OauthButtonsCtrl = $controller('OauthButtonsCtrl', {
      $window: $window
    });
  }));

  it('should attach loginOauth', function() {<% if (filters.jasmine) { %>
    expect(OauthButtonsCtrl.loginOauth).toEqual(jasmine.any(Function));<% } if (filters.mocha) { %>
    <%= expect() %>OauthButtonsCtrl.loginOauth<%= to() %>.be.a('function');<% } %>
  });
});
