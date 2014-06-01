'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('should render awesomeThings', function() {
    expect(page.firstAwesomeThingNameEl.getText()).toContain('Development Tools');
    page.awesomeThingsCount.then(function(count) {
      expect(count).toBe(6);
    });
  });
});
