/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */
/* eslint-env protractor, node */

export class OauthButtons {
    constructor() {
        this.oauthButtons = element(by.css('oauth-buttons'));<% if (filters.facebookAuth) { %>
        this.oauthButtons.facebook = this.oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-facebook'));<% } if (filters.googleAuth) { %>
        this.oauthButtons.google = this.oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-google'));<% } if (filters.twitterAuth) { %>
        this.oauthButtons.twitter = this.oauthButtons.element(by.css('.btn<% if (filters.bootstrap) { %>.btn-social<% } %>.btn-twitter'));<% } %>
    }
}
