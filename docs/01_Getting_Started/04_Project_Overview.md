## Project Overview

What follows is an overfiew of the files/folders in your newly generated project.

### Project Root

```
.babelrc // configuration for [Babel], a JavaScript transpiler
.editorconfig // config file used to keep conistent file editing across text editors
.eslintrc // all of the rules applying to the ESLint JavaScript linter
.travis.yml // a sample configuration file for Travis CI
.yo-rc.json // a configuration file for the Angular Full-Stack Generator
gulpfile.babel.js // Gulp task runner file
karma.conf.js // Karma browser testing configuration
mocha.conf.js // Mocha test framework configuration
mocha.global.js // teardown file for Mocha
package.json // npm manifest, contains information for all project dependencies
protractor.conf.js // configuration for Protractor e2e test framework
README.md // a readme file generator based on your options, for your scaffolded project
spec.js // test file for Webpack used by Karma
webpack.make.js // main file for Webpack configuration
    //The following export the config from `webpack.make.js` for their respective build targets:
    webpack.dev.js
    webpack.test.js
    webpack.build.js
```

### `client/`

```
│   .eslintrc // eslint config for client files
│   polyfills.js // imports of polyfills
│   _index.html // template for the root HTML file of your app
│
├───app
│   │   app.config.js // contains app-wide configuration code
│   │   app.constants.js // gets injected with constants from `server/config/environment/shared.js`
│   │   app.{js,ts} // root JavaScript file of your app
│   │   app.{css,scss,stylus,less} // root CSS file of your app
│   │
│   ├───account // pages related to login / signup / user settings
│   │   │   account.routes.js // route information
│   │   │   index.js // account module root
│   │   │
│   │   ├───login
│   │   ├───settings
│   │   └───signup
│   │
│   ├───admin // site admin page
│   │
│   └───main // main component, homepage
│
├───assets // where static assets are stored
│
└───components
    ├───auth
    │       auth.module.js // module containing auth components
    │       auth.service.js // authentication service
    │       interceptor.service.js // intercepts requests and adds tokens if needed. Also redirects 401s to the login page.
    │       router.decorator.js // facilitates auth-based routing configuration
    │       user.service.js // user resource service
    │
    ├───footer
    │
    ├───modal
    │
    ├───navbar
    │
    ├───oauth-buttons // buttons for oauth login on signup / login pages
    │
    ├───socket
    │       socket.mock.js // mock service for unit testing
    │       socket.service.js // service for Socket IO integration
    │
    ├───ui-router
    │       ui-router.mock.js // mock service for unit testing
    │
    └───util // general utility service
```

### `server/`

```
│   .eslintrc // server-specific ESLint config, imports rules from root file
│   app.js // root server module
│   index.js // imports `app.js`. Enables Babel require hook when in development mode.
│   routes.js // imports / config for server endpoints
│
├───api
│   ├───thing
│   │       index.js // root module
│   │       index.spec.js // root module tests
│   │       thing.controller.js // endpoint logic
│   │       thing.events.js // endpoint events (save, delete, etc) logic
│   │       thing.integration.js // integration tests
│   │       thing.model.js // Mongoose / Sequelize data model
│   │       thing.socket.js // Socket IO logic / config
│   │
│   └───user // API for Users
│
├───auth
│   │   auth.service.js
│   │   index.js // imports local/oauth auth modules
│   │
│   ├───local // regular auth, signed up directly via your site
│   ├───google // Google OAuth
│   └───<etc...>
│
└───config
    │   express.js // Express server setup
    │   local.env.js // ignored by Git
    │   local.env.sample.js // sensitive environment variables are stored here, and added at server start. Copy to `local.env.js`.
    │   seed.js // re-seeds database with fresh data
    │   websockets.js // WebSocket configuration / imports
    │
    └───environment
            development.js
            index.js
            production.js
            shared.js // config constants shared with the client code
            test.js
```

### `e2e/`

End-To-End testing files (use by [Protractor](https://github.com/angular/protractor) with [Mocha](https://github.com/mochajs/mocha))

[Babel]: https://babeljs.io/
