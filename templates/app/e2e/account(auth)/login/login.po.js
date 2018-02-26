/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

import {OauthButtons} from '../../components/oauth-buttons/oauth-buttons.po';

export class LoginPage {
    constructor() {
        this.form = element(by.css('.form'));
        const form = this.form;

        form.email = form.element(by.name('email'));
        form.password = form.element(by.name('password'));
        form.submit = form.element(by.css('.btn-login'));
        form.oauthButtons = (new OauthButtons()).oauthButtons;
    }

    login(data) {
        for(let prop in data) {
            let formElem = this.form[prop];
            if(data.hasOwnProperty(prop) && formElem && typeof formElem.sendKeys === 'function') {
                formElem.sendKeys(data[prop]);
            }
        }

        return this.form.submit.click();
    }
}
