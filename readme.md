# AngularJS Full-Stack generator
![Build Status](https://img.shields.io/codeship/26128390-800a-0133-c5f7-6a23b0487a18/master.svg)
[![npm version](https://img.shields.io/npm/v/generator-angular-fullstack.svg)](https://www.npmjs.com/package/generator-angular-fullstack)
[![Dependency Status](https://img.shields.io/david/angular-fullstack/generator-angular-fullstack.svg)](https://david-dm.org/angular-fullstack/generator-angular-fullstack)
[![Dev-Dependency Status](https://img.shields.io/david/dev/angular-fullstack/generator-angular-fullstack.svg)](https://david-dm.org/angular-fullstack/generator-angular-fullstack#info=devDependencies)
[![Gitter chat](https://img.shields.io/gitter/room/DaftMonk/generator-angular-fullstack.svg)](https://gitter.im/DaftMonk/generator-angular-fullstack)
[![OpenCollective](https://opencollective.com/angular-fullstack/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/angular-fullstack/sponsors/badge.svg)](#sponsors)
> Yeoman generator for creating MEAN/SEAN stack applications, using MongoDB/SQL, Express, AngularJS, and Node - lets you quickly set up a project following best practices.

#### Generated project: 
[![Dependency Status](https://img.shields.io/david/angular-fullstack/angular-fullstack-deps.svg)](https://david-dm.org/angular-fullstack/angular-fullstack-deps)
[![Dev-Dependency Status](https://img.shields.io/david/dev/angular-fullstack/angular-fullstack-deps.svg)](https://david-dm.org/angular-fullstack/angular-fullstack-deps#info=devDependencies)

## Usage

Install `yo`, `grunt-cli`/`gulp-cli`, `bower`, and `generator-angular-fullstack`:
```
npm install -g yo grunt-cli gulp-cli bower generator-angular-fullstack
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular-fullstack`, optionally passing an app name:
```
yo angular-fullstack [app-name]
```

Run `grunt`/`gulp build` for building, `grunt serve`/`gulp serve` for development, and `grunt serve:dist`/`gulp serve:dist` for a preview of the built app.

## Prerequisites

* MongoDB - Download and Install [MongoDB](https://www.mongodb.com/download-center#community) - If you plan on scaffolding your project with mongoose, you'll need mongoDB to be installed and have the `mongod` process running.

## Supported Configurations

**General**

* Build Systems: `Grunt`, `Gulp`
* Testing: 
  * `Jasmine`
  * `Mocha + Chai + Sinon`
    * Chai assertions:
      * `Expect`
      * `Should`

**Client**

* Scripts: `JavaScript (Babel)`, `TypeScript`
* Module Systems: `Bower`, `Webpack` (soon), `SystemJS + JSPM` (planned)
* Markup:  `HTML`, `Jade`
* Stylesheets: `CSS`, `Stylus`, `Sass`, `Less`
* Angular Routers: `ngRoute`, `ui-router`
* CSS Frameworks: `Bootstrap`
  * Option to include `UI Bootstrap`

**Server**

* Scripts: `JavaScript (Babel)`, `TypeScript` (planned)
* Database:
  * `None`,
  * `MongoDB`, `SQL`
    * Authentication boilerplate: `Yes`, `No`
    * oAuth integrations: `Facebook` `Twitter` `Google`
    * Socket.io integration: `Yes`, `No`


## Generators

Available generators:

* App
    - [angular-fullstack](/docs/generators/app.md) (aka [angular-fullstack:app](/docs/generators/app.md))
* Server Side
    - [angular-fullstack:endpoint](/docs/generators/endpoint.md)
* Client Side
    - [angular-fullstack:route](/docs/generators/route.md)
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


## Documentation

Check out our [documentation home page](/docs/index.md).


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

A grunt/gulp task looks for new files in your `client/app` and `client/components` folder and automatically injects them in the appropriate places based on an injection block.

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

Running `grunt test` will run the client and server unit tests with karma and mocha.

Use `grunt test:server` to only run server tests.

Use `grunt test:client` to only run client tests.

**Protractor tests**

To setup protractor e2e tests, you must first run

`npm run update-webdriver`

Use `grunt test:e2e` to have protractor go through tests located in the `e2e` folder.

**Code Coverage**

Use `grunt test:coverage` to run mocha-istanbul and generate code coverage reports.

`coverage/server` will be populated with `e2e` and `unit` folders containing the `lcov` reports.

The coverage taget has 3 available options:
- `test:coverage:unit` generate server unit test coverage
- `test:coverage:e2e` generate server e2e test coverage
- `test:coverage:check` combine the coverage reports and check against predefined thresholds

* *when no option is given `test:coverage` runs all options in the above order*

**Debugging**

Use `grunt serve:debug` for a more debugging-friendly environment.

## Environment Variables

Keeping your app secrets and other sensitive information in source control isn't a good idea. To have grunt launch your app with specific environment variables, add them to the git ignored environment config file: `server/config/local.env.js`.

## Project Structure

Overview

    ├── client
    │   ├── app                 - All of our app specific components go in here
    │   ├── assets              - Custom assets: fonts, images, etc…
    │   ├── components          - Our reusable components, non-specific to to our app
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

## Contribute

See the [contributing docs](https://github.com/DaftMonk/generator-angular-fullstack/blob/master/contributing.md)

When submitting an issue, please follow the [Yeoman issue guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue, as well as any stack traces.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)



## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/angular-fullstack#backer)]

<a href="https://opencollective.com/angular-fullstack/backer/0/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/0/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/1/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/1/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/2/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/2/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/3/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/3/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/4/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/4/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/5/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/5/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/6/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/6/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/7/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/7/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/8/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/8/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/9/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/9/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/10/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/10/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/11/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/11/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/12/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/12/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/13/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/13/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/14/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/14/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/15/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/15/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/16/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/16/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/17/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/17/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/18/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/18/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/19/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/19/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/20/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/20/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/21/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/21/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/22/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/22/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/23/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/23/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/24/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/24/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/25/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/25/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/26/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/26/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/27/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/27/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/28/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/28/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/backer/29/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/backer/29/avatar"></a>


## Sponsors

Is your company using Angular-FullStack? Ask your boss to support the project. You will get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/angular-fullstack#sponsor)]

<a href="https://opencollective.com/angular-fullstack/sponsor/0/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/0/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/1/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/1/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/2/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/2/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/3/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/3/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/4/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/4/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/5/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/5/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/6/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/6/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/7/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/7/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/8/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/8/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/9/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/9/avatar"></a>
<a href="https://opencollective.com/angular-fullstack/sponsor/10/website" target="_blank"><img src="https://opencollective.com/angular-fullstack/sponsor/10/avatar"></a>
