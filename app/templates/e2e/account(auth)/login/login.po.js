/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var LoginPage = function() {
  this.form = element(by.css('.form'));
  this.form.email = this.form.element(by.model('user.email'));
  this.form.password = this.form.element(by.model('user.password'));
  this.form.submit = this.form.element(by.css('.btn-login'));

  this.login = function(data) {
    for (var prop in data) {
      var formElem = this.form[prop];
      if (data.hasOwnProperty(prop) && formElem && typeof formElem.sendKeys === 'function') {
        formElem.sendKeys(data[prop]);
      }
    }

    this.form.submit.click();
  };
};

module.exports = new LoginPage();

