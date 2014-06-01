/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.heroEl = element(by.css('.hero-unit'));
  this.h1El = this.heroEl.element(by.css('h1'));
  this.imgEl = this.heroEl.element(by.css('img'));
  this.anchorEl = this.heroEl.element(by.css('a'));

  this.repeater = by.repeater('thing in awesomeThings');
  this.firstAwesomeThingNameEl = element(this.repeater.row(0).column('{{thing.name}}'));
  this.awesomeThingsCount = element.all(this.repeater).count();
};

module.exports = new MainPage();

