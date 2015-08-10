'use strict';

var config = browser.params;<% if (filters.mongooseModels) { %>
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');<% } %><% if (filters.sequelizeModels) { %>
var UserModel = require(config.serverConfig.root + '/server/sqldb').User;<% } %>

describe('Login View', function() {
  var page;

  var loadPage = function() {
    browser.get(config.baseUrl + '/login');
    page = require('./login.po');
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
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
    <%= expect() %>page.form.email.getAttribute('type')<%= to() %>.eventually.equal('email');
    <%= expect() %>page.form.email.getAttribute('name')<%= to() %>.eventually.equal('email');
    <%= expect() %>page.form.password.getAttribute('type')<%= to() %>.eventually.equal('password');
    <%= expect() %>page.form.password.getAttribute('name')<%= to() %>.eventually.equal('password');
    <%= expect() %>page.form.submit.getAttribute('type')<%= to() %>.eventually.equal('submit');
    <%= expect() %>page.form.submit.getText()<%= to() %>.eventually.equal('Login');
  });<% if (filters.oauth) { %>

  it('should include oauth buttons with correct classes applied', function() {<% if (filters.facebookAuth) { %>
    <%= expect() %>page.form.oauthButtons.facebook.getText()<%= to() %>.eventually.equal('Connect with Facebook');
    <%= expect() %>page.form.oauthButtons.facebook.getAttribute('class')<%= to() %>.eventually.contain('btn-block');<% } if (filters.googleAuth) { %>
    <%= expect() %>page.form.oauthButtons.google.getText()<%= to() %>.eventually.equal('Connect with Google+');
    <%= expect() %>page.form.oauthButtons.google.getAttribute('class')<%= to() %>.eventually.contain('btn-block');<% } if (filters.twitterAuth) { %>
    <%= expect() %>page.form.oauthButtons.twitter.getText()<%= to() %>.eventually.equal('Connect with Twitter');
    <%= expect() %>page.form.oauthButtons.twitter.getAttribute('class')<%= to() %>.eventually.contain('btn-block');<% } %>
  });<% } %>

  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {
      page.login(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      <%= expect() %>browser.getCurrentUrl()<%= to() %>.eventually.equal(config.baseUrl + '/');
      <%= expect() %>navbar.navbarAccountGreeting.getText()<%= to() %>.eventually.equal('Hello ' + testUser.name);
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

        <%= expect() %>browser.getCurrentUrl()<%= to() %>.eventually.equal(config.baseUrl + '/login');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        <%= expect() %>helpBlock.getText()<%= to() %>.eventually.equal('This password is not correct.');
      });

    });

  });
});
