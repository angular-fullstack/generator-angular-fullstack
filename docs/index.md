# Documentation Home

## Generators

Available generators:

* App
    - [angular-fullstack](/docs/generators/app.md) (aka [angular-fullstack:app](/docs/generators/app.md))
* Server Side
    - [angular-fullstack:endpoint](/docs/generators/endpoint.md)
* Client Side (via [generator-ng-component](https://github.com/DaftMonk/generator-ng-component))
    - [angular-fullstack:route](/docs/generators/route.md)
    - [angular-fullstack:component](/docs/generators/component.md)
    - [angular-fullstack:controller](/docs/generators/controller.md)
    - [angular-fullstack:filter](/docs/generators/filter.md)
    - [angular-fullstack:directive](/docs/generators/directive.md)
    - [angular-fullstack:service](/docs/generators/service.md)
    - [angular-fullstack:provider](/docs/generators/service.md)
    - [angular-fullstack:factory](/docs/generators/service.md)
    - [angular-fullstack:decorator](/docs/generators/decorator.md)
* Deployment
    - [angular-fullstack:openshift](/docs/generators/openshift.md)
    - [angular-fullstack:heroku](/docs/generators/heroku.md)


## Bower Components

The following packages are always installed by the [app](#app) generator:

* angular
* angular-cookies
* angular-mocks
* angular-resource
* angular-sanitize
* es5-shim
* font-awesome
* json3
* jquery
* lodash

These packages are installed optionally depending on your configuration:

* angular-route
* angular-ui-router
* angular-socket-io
* angular-bootstrap
* bootstrap

All of these can be updated with `bower update` as new versions are released.

## Injection

A gulp task looks for new files in your `client/app` and `client/components` folder and automatically injects them in the appropriate places based on an injection block.

* `less` files into `client/app/app.less`
* `scss` files into `client/app/app.scss`
* `stylus` files into `client/app/app.styl`
* `css` files into `client/index.html`
* `js` files into `client/index.html`
* `babel`/`typescript` temp `js` files into `client/index.html`
* `typescript types` into `tsconfig.client.json` & `tsconfig.client.test.json`


## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

A `.yo-rc` file is generated for helping you copy configuration across projects, and to allow you to keep track of your settings. You can change this as you see fit.

## Testing

Running `gulp test` will run the client and server unit tests with karma and mocha.

Use `gulp test:server` to only run server tests.

Use `gulp test:client` to only run client tests.

**Protractor tests**

To setup protractor e2e tests, you must first run

`npm run update-webdriver`

Use `gulp test:e2e` to have protractor go through tests located in the `e2e` folder.

**Code Coverage**

Use `gulp test:coverage` to run mocha-istanbul and generate code coverage reports.

`coverage/server` will be populated with `e2e` and `unit` folders containing the `lcov` reports.

The coverage taget has 3 available options:
- `test:coverage:unit` generate server unit test coverage
- `test:coverage:e2e` generate server e2e test coverage
- `test:coverage:check` combine the coverage reports and check against predefined thresholds

* *when no option is given `test:coverage` runs all options in the above order*

**Debugging**

Use `gulp serve:debug` for a more debugging-friendly environment.

## Environment Variables

Keeping your app secrets and other sensitive information in source control isn't a good idea.
To have gulp launch your app with specific environment variables, add them to the git ignored environment config file: `server/config/local.env.js`.

## Project Structure

Overview

    ├── client
    │   ├── app                 - All of our app specific components go in here
    │   ├── assets              - Custom assets: fonts, images, etc…
    │   ├── components          - Our reusable components, non-specific to our app
    │
    ├── e2e                     - Our protractor end to end tests
    │
    └── server
        ├── api                 - Our apps server api
        ├── auth                - For handling authentication with different auth strategies
        ├── components          - Our reusable or app-wide components
        ├── config              - Where we do the bulk of our apps configuration
        │   └── local.env.js    - Keep our environment variables out of source control
        │   └── environment     - Configuration specific to the node environment
        └── views               - Server rendered views

An example client component in `client/app`

    main
    ├── main.js                 - Routes
    ├── main.controller.js      - Controller for our main route
    ├── main.controller.spec.js - Test
    ├── main.html               - View
    └── main.less               - Styles

An example server component in `server/api`

    thing
    ├── index.js                - Routes
    ├── thing.controller.js     - Controller for our `thing` endpoint
    ├── thing.model.js          - Database model
    ├── thing.socket.js         - Register socket events
    └── thing.spec.js           - Test
