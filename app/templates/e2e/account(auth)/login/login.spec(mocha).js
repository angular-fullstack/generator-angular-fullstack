'use strict';

var config = browser.params;<% if (filters.mongooseModels) { %>
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

  before(function() {
    return UserModel
      <% if (filters.mongooseModels) { %>.removeAsync()<% }
         if (filters.sequelizeModels) { %>.destroy({ where: {} })<% } %>
      .then(function() {
        <% if (filters.mongooseModels) { %>return UserModel.createAsync(testUser);<% }
           if (filters.sequelizeModels) { %>return UserModel.create(testUser);<% } %>
      })
      .then(loadPage);
  });

  after(function() {
    <% if (filters.mongooseModels) { %>return UserModel.removeAsync();<% }
       if (filters.sequelizeModels) { %>return UserModel.destroy({ where: {} });<% } %>
  });

  it('should include login form with correct inputs and submit button', function() {
    <%= does("page.form.email.getAttribute('type')") %>.eventually.equal('email');
    <%= does("page.form.email.getAttribute('name')") %>.eventually.equal('email');
    <%= does("page.form.password.getAttribute('type')") %>.eventually.equal('password');
    <%= does("page.form.password.getAttribute('name')") %>.eventually.equal('password');
    <%= does("page.form.submit.getAttribute('type')") %>.eventually.equal('submit');
    <%= does("page.form.submit.getText()") %>.eventually.equal('Login');
  });

  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {
      page.login(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      <%= does("browser.getLocationAbsUrl()") %>.eventually.equal(config.baseUrl + '/');
      <%= does("navbar.navbarAccountGreeting.getText()") %>.eventually.equal('Hello ' + testUser.name);
    });

    describe('and invalid credentials', function() {
      before(function() {
        return loadPage();
      })

      it('should indicate login failures', function() {
        page.login({
          email: testUser.email,
          password: 'badPassword'
        });

        <%= does("browser.getLocationAbsUrl()") %>.eventually.equal(config.baseUrl + '/login');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        <%= does("helpBlock.getText()") %>.eventually.equal('This password is not correct.');
      });

    });

  });
});
