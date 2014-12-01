'use strict';

var config = protractor.getInstance().params;<% if (filters.mongooseModels) { %>
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');<% } %><% if (filters.sequelizeModels) { %>
var UserModel = require(config.serverConfig.root + '/server/sqldb').User;<% } %>

describe('Signup View', function() {
  var page;

  var loadPage = function() {
    browser.get('/signup');
    page = require('./signup.po');
  };

  var testUser = {
    name: 'Test',
    email: 'test@test.com',
    password: 'test'
  };

  beforeEach(function() {
    loadPage();
  });

  it('should include signup form with correct inputs and submit button', function() {
    expect(page.form.name.getAttribute('type')).toBe('text');
    expect(page.form.name.getAttribute('name')).toBe('name');
    expect(page.form.email.getAttribute('type')).toBe('email');
    expect(page.form.email.getAttribute('name')).toBe('email');
    expect(page.form.password.getAttribute('type')).toBe('password');
    expect(page.form.password.getAttribute('name')).toBe('password');
    expect(page.form.submit.getAttribute('type')).toBe('submit');
    expect(page.form.submit.getText()).toBe('Sign up');
  });

  describe('with local auth', function() {

    it('should signup a new user, log them in, and redirecting to "/"', function(done) {
      <% if (filters.mongooseModels) { %>UserModel.remove(function() {<% }
         if (filters.sequelizeModels) { %>UserModel.destroy().then(function() {<% } %>
        page.signup(testUser);

        var navbar = require('../../components/navbar/navbar.po');

        expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/');
        expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);

        done();
      });
    });

    it('should indicate signup failures', function() {
      page.signup(testUser);

      expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/signup');
      expect(page.form.email.getAttribute('class')).toContain('ng-invalid-mongoose');

      var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
      expect(helpBlock.getText()).toBe('The specified email address is already in use.');
    });

  });
});
