'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    <%= does("page.h1El.getText()") %>.eventually.equal('\'Allo, \'Allo!');
    <%= does("page.imgEl.getAttribute('src')") %>.eventually.match(/assets\/images\/yeoman.png$/);
    <%= does("page.imgEl.getAttribute('alt')") %>.eventually.equal('I\'m Yeoman');
  });
});
