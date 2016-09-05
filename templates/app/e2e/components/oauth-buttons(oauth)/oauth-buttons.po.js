/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var OauthButtons = function() {
  var oauthButtons = this.oauthButtons = element(by.css('oauth-buttons'));<% if (filters.facebookAuth) { %>
  oauthButtons.facebook = oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-facebook'));<% } if (filters.googleAuth) { %>
  oauthButtons.google = oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-google'));<% } if (filters.twitterAuth) { %>
  oauthButtons.twitter = oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-twitter'));<% } %>
};

module.exports = new OauthButtons();
