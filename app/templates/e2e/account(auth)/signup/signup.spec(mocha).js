'use strict';

var config = protractor.getInstance().params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

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

  before(function() {
    return loadPage();
  });

  after(function() {
    return UserModel.removeAsync();
  });

  it('should include signup form with correct inputs and submit button', function() {
    <%= does("page.form.name.getAttribute('type')") %>.eventually.equal('text');
    <%= does("page.form.name.getAttribute('name')") %>.eventually.equal('name');
    <%= does("page.form.email.getAttribute('type')") %>.eventually.equal('email');
    <%= does("page.form.email.getAttribute('name')") %>.eventually.equal('email');
    <%= does("page.form.password.getAttribute('type')") %>.eventually.equal('password');
    <%= does("page.form.password.getAttribute('name')") %>.eventually.equal('password');
    <%= does("page.form.submit.getAttribute('type')") %>.eventually.equal('submit');
    <%= does("page.form.submit.getText()") %>.eventually.equal('Sign up');
  });

  describe('with local auth', function() {

    it('should signup a new user, log them in, and redirecting to "/"', function(done) {
      UserModel.remove(function() {
        page.signup(testUser);

        var navbar = require('../../components/navbar/navbar.po');

        <%= does("browser.getLocationAbsUrl()") %>.eventually.equal(config.baseUrl + '/');
        <%= does("navbar.navbarAccountGreeting.getText()") %>.eventually.equal('Hello ' + testUser.name);

        done();
      });
    });

    describe('and invalid credentials', function() {
      before(function() {
        return loadPage();
      });

      it('should indicate signup failures', function() {
        page.signup(testUser);

        <%= does("browser.getLocationAbsUrl()") %>.eventually.equal(config.baseUrl + '/signup');
        <%= does("page.form.email.getAttribute('class')") %>.eventually.contain('ng-invalid-mongoose');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        <%= does("helpBlock.getText()") %>.eventually.equal('The specified email address is already in use.');
      });

    });

  });
});
