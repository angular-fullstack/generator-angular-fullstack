let config = browser.params;
import {MainPage} from './main.po';

describe('Main View', function() {
    let page;

    beforeEach(() => {
        return browser.get(`${config.baseUrl}/`).then(() => {
            page = new MainPage();
        });
    });

    it('should include jumbotron with correct data', function() {
        <%= expect() %>page.h1El.getText()<%= to() %>.eventually.equal('\'Allo, \'Allo!');
        <%= expect() %>page.imgEl.getAttribute('src')<%= to() %>.eventually.match(/yeoman(\.[a-zA-Z0-9]*)?\.png$/);
        <%= expect() %>page.imgEl.getAttribute('alt')<%= to() %>.eventually.equal('I\'m Yeoman');
    });
});
