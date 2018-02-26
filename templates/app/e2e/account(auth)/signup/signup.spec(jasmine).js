const config = browser.params;<% if (filters.mongooseModels) { %>
import UserModel from '../../../server/api/user/user.model';<% } %><% if (filters.sequelizeModels) { %>
import {User as UserModel} from '../../../server/sqldb';<% } %>
import {SignupPage} from './signup.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Signup View', function() {
    let page;

    const loadPage = () => {
        browser.manage().deleteAllCookies();
        return browser.get(`${config.baseUrl}/signup`).then(() => {
            page = new SignupPage();
        });
    };

    const testUser = {
        name: 'Test',
        email: 'test@example.com',
        password: 'test1234',
        confirmPassword: 'test1234'
    };

    beforeEach(() => loadPage());

    it('should include signup form with correct inputs and submit button', function() {
        expect(page.form.name.getAttribute('type')).toBe('text');
        expect(page.form.name.getAttribute('name')).toBe('name');
        expect(page.form.email.getAttribute('type')).toBe('email');
        expect(page.form.email.getAttribute('name')).toBe('email');
        expect(page.form.password.getAttribute('type')).toBe('password');
        expect(page.form.password.getAttribute('name')).toBe('password');
        expect(page.form.confirmPassword.getAttribute('type')).toBe('password');
        expect(page.form.confirmPassword.getAttribute('name')).toBe('confirmPassword');
        expect(page.form.submit.getAttribute('type')).toBe('submit');
        expect(page.form.submit.getText()).toBe('Sign up');
    });<% if (filters.oauth) { %>

    it('should include oauth buttons with correct classes applied', function() {<% if (filters.facebookAuth) { %>
        expect(page.form.oauthButtons.facebook.getText()).toBe('Connect with Facebook');<% } if (filters.googleAuth) { %>
        expect(page.form.oauthButtons.google.getText()).toBe('Connect with Google+');<% } if (filters.twitterAuth) { %>
        expect(page.form.oauthButtons.twitter.getText()).toBe('Connect with Twitter');<% } %>
    });<% } %>

    describe('with local auth', function() {
        beforeAll(() => {
            return <% if (filters.mongooseModels) { %>UserModel.remove().then(done);<% }
               if (filters.sequelizeModels) { %>UserModel.destroy({ where: {} }).then(done);<% } %>
        });

        it('should signup a new user, log them in, and redirecting to "/"', async function() {
            await page.signup(testUser);

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            let navbar = new NavbarComponent();

            expect(await browser.getCurrentUrl()).toBe(`${config.baseUrl}/home`);
            expect(await navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);
        });

        it('should indicate signup failures', async function() {
            await page.signup(testUser);

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            expect(await browser.getCurrentUrl()).toBe(`${config.baseUrl}/signup`);

            let helpBlock = page.form.element(by.css('.form-group.has-error .help-block:not([hidden])'));
            expect(await helpBlock.getText()).toBe('This email address is already in use.');
        });
    });
});
