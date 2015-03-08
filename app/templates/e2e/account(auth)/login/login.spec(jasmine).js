'use strict';

var config = protractor.getInstance().params;<% if (filters.mongooseModels) { %>
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');<% } %><% if (filters.sequelizeModels) { %>
var UserModel = require(config.serverConfig.root + '/server/sqldb').User;<% } %>

describe('Login View', function() {
  var page;

  var loadPage = function() {
    browser.get('/login');
    page = require('./login.po');
  };

  var testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  };

  beforeEach(function(done) {
    <% if (filters.mongooseModels) { %>UserModel.removeAsync()<% }
       if (filters.sequelizeModels) { %>UserModel.destroy()<% } %>
      .then(function() {
        <% if (filters.mongooseModels) { %>return UserModel.createAsync(testUser);<% }
           if (filters.sequelizeModels) { %>return UserModel.create(testUser);<% } %>
      })
      .then(loadPage)
      .finally(done);
  });

  it('should include login form with correct inputs and submit button', function() {
    expect(page.form.email.getAttribute('type')).toBe('email');
    expect(page.form.email.getAttribute('name')).toBe('email');
    expect(page.form.password.getAttribute('type')).toBe('password');
    expect(page.form.password.getAttribute('name')).toBe('password');
    expect(page.form.submit.getAttribute('type')).toBe('submit');
    expect(page.form.submit.getText()).toBe('Login');
  });

  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {
      page.login(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);
    });

    it('should indicate login failures', function() {
      page.login({
        email: testUser.email,
        password: 'badPassword'
      });

      expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/login');

      var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
      expect(helpBlock.getText()).toBe('This password is not correct.');
    });

  });
});
