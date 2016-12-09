/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

var OauthButtons = function() {
  var oauthButtons = this.oauthButtons = element(by.css('oauth-buttons'));
  <%_ if(filters.facebookAuth) { -%>
  oauthButtons.facebook = oauthButtons.element(by.css('.btn<% if(filters.bootstrap) { %>.btn-social<% } %>.btn-facebook'));<% } %>
  <%_ if(filters.googleAuth) { -%>
  oauthButtons.google = oauthButtons.element(by.css('.btn<% if(filters.bootstrap) { %>.btn-social<% } %>.btn-google'));<% } %>
  <%_ if(filters.twitterAuth) { -%>
  oauthButtons.twitter = oauthButtons.element(by.css('.btn<% if(filters.bootstrap) { %>.btn-social<% } %>.btn-twitter'));<% } %>
  <%_ if(filters.githubAuth) { -%>
  oauthButtons.github = oauthButtons.element(by.css('.btn<% if(filters.bootstrap) { %>.btn-social<% } %>.btn-github'));<% } %>
};

module.exports = new OauthButtons();
