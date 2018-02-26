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
        expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
        expect(page.imgEl.getAttribute('src')).toMatch(/yeoman(\.[a-zA-Z0-9]*)?\.png$/);
        expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
    });
});
