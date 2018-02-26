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

    before(() => loadPage());

    after(() => {
        <% if (filters.mongooseModels) { %>return UserModel.remove();<% }
           if (filters.sequelizeModels) { %>return UserModel.destroy({ where: {} });<% } %>
    });

    it('should include signup form with correct inputs and submit button', function() {
        <%= expect() %>page.form.name.getAttribute('type')<%= to() %>.eventually.equal('text');
        <%= expect() %>page.form.name.getAttribute('name')<%= to() %>.eventually.equal('name');
        <%= expect() %>page.form.email.getAttribute('type')<%= to() %>.eventually.equal('email');
        <%= expect() %>page.form.email.getAttribute('name')<%= to() %>.eventually.equal('email');
        <%= expect() %>page.form.password.getAttribute('type')<%= to() %>.eventually.equal('password');
        <%= expect() %>page.form.password.getAttribute('name')<%= to() %>.eventually.equal('password');
        <%= expect() %>page.form.confirmPassword.getAttribute('type')<%= to() %>.eventually.equal('password');
        <%= expect() %>page.form.confirmPassword.getAttribute('name')<%= to() %>.eventually.equal('confirmPassword');
        <%= expect() %>page.form.submit.getAttribute('type')<%= to() %>.eventually.equal('submit');
        <%= expect() %>page.form.submit.getText()<%= to() %>.eventually.equal('Sign up');
    });<% if (filters.oauth) { %>

    it('should include oauth buttons with correct classes applied', function() {<% if (filters.facebookAuth) { %>
        <%= expect() %>page.form.oauthButtons.facebook.getText()<%= to() %>.eventually.equal('Connect with Facebook');<% } if (filters.googleAuth) { %>
        <%= expect() %>page.form.oauthButtons.google.getText()<%= to() %>.eventually.equal('Connect with Google+');<% } if (filters.twitterAuth) { %>
        <%= expect() %>page.form.oauthButtons.twitter.getText()<%= to() %>.eventually.equal('Connect with Twitter');<% } %>
    });<% } %>

    describe('with local auth', function() {
        before(() => {
            <% if (filters.mongooseModels) { %>return UserModel.remove();<% }
               if (filters.sequelizeModels) { %>return UserModel.destroy({ where: {} });<% } %>
        });

        it('should signup a new user, log them in, and redirecting to "/"', async function() {
            await page.signup(testUser);

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            let navbar = new NavbarComponent();

            <%= expect() %>(await browser.getCurrentUrl())<%= to() %>.equal(`${config.baseUrl}/home`);
            <%= expect() %>(await navbar.navbarAccountGreeting.getText())<%= to() %>.equal(`Hello ${testUser.name}`);
        });

        describe('and invalid credentials', function() {
            before(() => loadPage());

            it('should indicate signup failures', async function() {
                await page.signup(testUser);

                browser.ignoreSynchronization = false;
                await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
                browser.ignoreSynchronization = true;

                <%= expect() %>(await browser.getCurrentUrl())<%= to() %>.equal(`${config.baseUrl}/signup`);

                let helpBlock = page.form.element(by.css('.form-group.has-error .help-block:not([hidden])'));
                <%= expect() %>(await helpBlock.getText())<%= to() %>.equal('This email address is already in use.');
            });
        });
    });
});
