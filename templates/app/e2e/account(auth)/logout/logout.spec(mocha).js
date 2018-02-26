const config = browser.params;<% if (filters.mongooseModels) { %>
import UserModel from '../../../server/api/user/user.model';<% } %><% if (filters.sequelizeModels) { %>
import {User as UserModel} from '../../../server/sqldb';<% } %>
import {LoginPage} from '../login/login.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Logout View', function() {
    const login = async (user) => {
        await browser.get(`${config.baseUrl}/login`);

        const loginPage = new LoginPage();
        await loginPage.login(user);
    };

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    };

    beforeEach(async function() {
        await UserModel
            <% if (filters.mongooseModels) { %>.remove();<% }
             if (filters.sequelizeModels) { %>.destroy({ where: {} });<% } %>

        <% if (filters.mongooseModels) { %>await UserModel.create(testUser);<% }
           if (filters.sequelizeModels) { %>await UserModel.create(testUser);<% } %>

        await login(testUser);
    });

    after(function() {
        <% if (filters.mongooseModels) { %>return UserModel.remove();<% }
           if (filters.sequelizeModels) { %>return UserModel.destroy({ where: {} });<% } %>
    });

    describe('with local auth', function() {
        it('should logout a user and redirect to "/home"', async function() {
            let navbar = new NavbarComponent();

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            <%= expect() %>(await browser.getCurrentUrl())<%= to() %>.equal(`${config.baseUrl}/home`);
            <%= expect() %>(await navbar.navbarAccountGreeting.getText())<%= to() %>.equal(`Hello ${testUser.name}`);

            await navbar.logout();

            navbar = new NavbarComponent();

            <%= expect() %>(await browser.getCurrentUrl())<%= to() %>.equal(`${config.baseUrl}/home`);
            <%= expect() %>(await navbar.navbarAccountGreeting.isDisplayed())<%= to() %>.equal(false);
        });
    });
});
