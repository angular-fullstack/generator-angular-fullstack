<a name="3.0.2"></a>
## [3.0.2](https://github.com/DaftMonk/generator-angular-fullstack/compare/3.0.1...3.0.2) (2015-12-05)


### Bug Fixes

* **api:user:** remove `password` before sending user objects instead of `hashedPassword` ([c08bd95](https://github.com/DaftMonk/generator-angular-fullstack/commit/c08bd95)), closes [#1459](https://github.com/DaftMonk/generator-angular-fullstack/issues/1459)
* **client:auth:** remove decorator logic ([3229acd](https://github.com/DaftMonk/generator-angular-fullstack/commit/3229acd)), closes [#1455](https://github.com/DaftMonk/generator-angular-fullstack/issues/1455)

<a name="3.0.1"></a>
## [3.0.1](https://github.com/DaftMonk/generator-angular-fullstack/compare/3.0.0...3.0.1) (2015-12-04)


This version just changes the recommended Node version to ^4.2.3, since it fixes some vulnerabilities. Also, the Travis-CI config has been changed to loosely test Node 5.1.1 instead of 5.0.0.


<a name="3.0.0"></a>
# [3.0.0](https://github.com/DaftMonk/generator-angular-fullstack/compare/2.1.1...3.0.0) (2015-12-06)

# 3.0.0

### New Features

 * **Sequelize** - You can now choose between MongoDB + Mongoose or SQLite3 + Sequelize
 * **Babel** - We now include Babel transpiler support, with plans to add TypeScript in the future
 * **Lusca** - Lusca Security Middleware is included by default
 * **Angular Modules** - A few components of the front-end have been broken out into their own Angular modules, such as `auth`, `admin`, and a new `util` module
 * **Modern Angular Best-Practices** - We have moved a lot of the code to take advantage of the `controllerAs` syntax, as well as ES6/ES7 Classes
 * Mongoose Bluebird Promises

### Breaking Changes

 * **Node >= 4.2.2** - We now support versions of Node 4.2.2 and up. Since this is a generator for scaffolding out a new project, it makes sense to move support to the 4.2.2 Long Term Support (LTS) version of Node, since it is the most supported release by Node. It is likely that the generator will work with earlier versions of Node, but it is not recommended.
 * **~~CoffeeScript~~, ~~Vanilla JS~~** - Removed CoffeeScript and vanilla JS support. CoffeeScript has served its purpose and been replaced by much better transpilers. Vanilla JS doesn't provide a lot of the features that enable good, modern code. We now only support Babel 5.8.x, and plan to add TypeScript support in the future.
 * Removed some backwards-compatibility support code

To see the full list of changes, click the '3.0.0' title to view the GitHub compare between 3.0.0 and 2.1.1

<a name="2.1.1"></a>
## [2.1.1](https://github.com/DaftMonk/generator-angular-fullstack/compare/2.1.0...2.1.1) (2015-07-29)


### Bug Fixes

* **app:** 
  * correct grunt clean glob ([8e8ae96](https://github.com/DaftMonk/generator-angular-fullstack/commit/8e8ae96))
  * ensure all files end with a newline ([8511260](https://github.com/DaftMonk/generator-angular-fullstack/commit/8511260))
  * fix folder depth in rev and usemin globs ([18f8d31](https://github.com/DaftMonk/generator-angular-fullstack/commit/18f8d31))
  * update sequelize syntax in seed.js ([a9372a1](https://github.com/DaftMonk/generator-angular-fullstack/commit/a9372a1))
  * use 0.0.0.0 for default IP ([2cd1c24](https://github.com/DaftMonk/generator-angular-fullstack/commit/2cd1c24)), closes [DaftMonk/generator-angular-fullstack#1071](https://github.com/DaftMonk/generator-angular-fullstack/issues/1071)
* **app:test:** include `client/components` in babel preprocessing ([6b575d1](https://github.com/DaftMonk/generator-angular-fullstack/commit/6b575d1)), closes [DaftMonk/generator-angular-fullstack#1081](https://github.com/DaftMonk/generator-angular-fullstack/issues/1081)
* **build:** exclued `bower_components` from the grunt rev and usemin blocks ([7ae43ae](https://github.com/DaftMonk/generator-angular-fullstack/commit/7ae43ae)), closes [#522](https://github.com/DaftMonk/generator-angular-fullstack/issues/522)
* **test:** 
  * update protractor test for angular 1.4 ([f5acad0](https://github.com/DaftMonk/generator-angular-fullstack/commit/f5acad0))
  * use proper controlFlow in protractor tests ([8dce663](https://github.com/DaftMonk/generator-angular-fullstack/commit/8dce663))

### Features

* **app:** 
  * improve `Gruntfile.js` file globbing ([5874dfd](https://github.com/DaftMonk/generator-angular-fullstack/commit/5874dfd))
  * merge H5BP updates to index.html ([4a88551](https://github.com/DaftMonk/generator-angular-fullstack/commit/4a88551))
  * watch integration tests for changes ([a81aeb1](https://github.com/DaftMonk/generator-angular-fullstack/commit/a81aeb1))
* **build:** switch to grunt-filerev ([cd28298](https://github.com/DaftMonk/generator-angular-fullstack/commit/cd28298))
* **test:** add jasmine-spec-reporter ([f34e8f3](https://github.com/DaftMonk/generator-angular-fullstack/commit/f34e8f3))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.13...2.1.0) (2015-07-15)


### Bug Fixes

* **app:** missing event.preventDefault ([c90d762](https://github.com/DaftMonk/generator-angular-fullstack/commit/c90d762))
* **app-logout:** add blank templates to logout route/state ([650d244](https://github.com/DaftMonk/generator-angular-fullstack/commit/650d244)), closes [#570](https://github.com/DaftMonk/generator-angular-fullstack/issues/570)
* **app-signup:** switch button classes ([5898e0c](https://github.com/DaftMonk/generator-angular-fullstack/commit/5898e0c))
* **demo:** include bootstrap in demo ([19e2133](https://github.com/DaftMonk/generator-angular-fullstack/commit/19e2133))
* **deps:** use angular ~1.2 before migrated to 1.3 ([6a196e2](https://github.com/DaftMonk/generator-angular-fullstack/commit/6a196e2)), closes [#654](https://github.com/DaftMonk/generator-angular-fullstack/issues/654)
* **endpoint:** 
  * fully support sequelize models ([df82d17](https://github.com/DaftMonk/generator-angular-fullstack/commit/df82d17))
  * refactor handleError for promise use ([0af7c3e](https://github.com/DaftMonk/generator-angular-fullstack/commit/0af7c3e))
* **endpoint:thing:** use Express 4 syntax ([c7b48a5](https://github.com/DaftMonk/generator-angular-fullstack/commit/c7b48a5))
* **endpoint:user:** refactor validationError for promise use ([c98cb5d](https://github.com/DaftMonk/generator-angular-fullstack/commit/c98cb5d))
* **express:** support new options of updated connect-mongo ([727d661](https://github.com/DaftMonk/generator-angular-fullstack/commit/727d661))
* **gen:** 
  * camelCase endpoint name when used in variable name ([7362080](https://github.com/DaftMonk/generator-angular-fullstack/commit/7362080)), closes [#540](https://github.com/DaftMonk/generator-angular-fullstack/issues/540)
  * Check that answers.odms exists ([342606c](https://github.com/DaftMonk/generator-angular-fullstack/commit/342606c))
  * filter `client/components/socket` js files ([49d5bbd](https://github.com/DaftMonk/generator-angular-fullstack/commit/49d5bbd)), closes [#530](https://github.com/DaftMonk/generator-angular-fullstack/issues/530)
* **gen:build:** Adds missing slash ([bb4d92e](https://github.com/DaftMonk/generator-angular-fullstack/commit/bb4d92e))
* **gen:endpoint:** Fix JSCS stuff and use Express 4 syntax ([1bcffd6](https://github.com/DaftMonk/generator-angular-fullstack/commit/1bcffd6))
* **git:** Remove old text=auto ([e0350cc](https://github.com/DaftMonk/generator-angular-fullstack/commit/e0350cc))
* **jshint:** Removed 'regexp' from server and client jshintrc (I couldn't find it in the docs ([e02f094](https://github.com/DaftMonk/generator-angular-fullstack/commit/e02f094))
* **model:** fix update bugs with mongoose and sequelize ([1805975](https://github.com/DaftMonk/generator-angular-fullstack/commit/1805975))
* **npm:** Remove git diff comment ([349b6d3](https://github.com/DaftMonk/generator-angular-fullstack/commit/349b6d3))
* **oauth:** 
  * Facebook API updated ([f6e7a12](https://github.com/DaftMonk/generator-angular-fullstack/commit/f6e7a12))
  * Google scopes deprecated ([136f15e](https://github.com/DaftMonk/generator-angular-fullstack/commit/136f15e))
* return a 404 when no user is found fixes #711 ([38c0d7c](https://github.com/DaftMonk/generator-angular-fullstack/commit/38c0d7c)), closes [#711](https://github.com/DaftMonk/generator-angular-fullstack/issues/711)
* **openshift:** fix processing of rhc app show output ([dedf46c](https://github.com/DaftMonk/generator-angular-fullstack/commit/dedf46c))
* **server:** server should launch in dev mode if production env var is not specified ([9cdcc90](https://github.com/DaftMonk/generator-angular-fullstack/commit/9cdcc90)), closes [#590](https://github.com/DaftMonk/generator-angular-fullstack/issues/590)
* **server-tests:** `test:coverage` task ([5198685](https://github.com/DaftMonk/generator-angular-fullstack/commit/5198685))
* **test:** 
  * change `protractor.getInstance` to `browser` ([c7f6c36](https://github.com/DaftMonk/generator-angular-fullstack/commit/c7f6c36))
  * remove package.json and bower.json ([0ec2e18](https://github.com/DaftMonk/generator-angular-fullstack/commit/0ec2e18))
  * update sequelize destroy usage ([8df9992](https://github.com/DaftMonk/generator-angular-fullstack/commit/8df9992))
* **travis:** 
  * Add nodejs 12 to travis.yml ([acecde9](https://github.com/DaftMonk/generator-angular-fullstack/commit/acecde9))
  * remove node v0.11 from testing ([dae69cf](https://github.com/DaftMonk/generator-angular-fullstack/commit/dae69cf))
  * Remove unicode stuff from file creation test expectations, and add nodejs 0.12 t ([bf9a973](https://github.com/DaftMonk/generator-angular-fullstack/commit/bf9a973))

### Features

* **app:** 
  * add grunt jscs task for maintaining consistent code style ([8a1a245](https://github.com/DaftMonk/generator-angular-fullstack/commit/8a1a245))
  * add mongodb error handling to quit app if unable to connect with mongodb server  ([31bee73](https://github.com/DaftMonk/generator-angular-fullstack/commit/31bee73))
  * additional app generator option for ES6 preprocessing using babel ([bc03aba](https://github.com/DaftMonk/generator-angular-fullstack/commit/bc03aba))
  * additional app generator option for ES6 preprocessing using babel ([cbb06a4](https://github.com/DaftMonk/generator-angular-fullstack/commit/cbb06a4))
  * implement footer as directive ([cf298a7](https://github.com/DaftMonk/generator-angular-fullstack/commit/cf298a7))
  * implement navbar as directive ([24171aa](https://github.com/DaftMonk/generator-angular-fullstack/commit/24171aa))
* **app-auth:** Improve client-side Auth service ([65d03fc](https://github.com/DaftMonk/generator-angular-fullstack/commit/65d03fc)), closes [#456](https://github.com/DaftMonk/generator-angular-fullstack/issues/456)
* **app-routing:** improve app routing ([6aadee6](https://github.com/DaftMonk/generator-angular-fullstack/commit/6aadee6)), closes [#331](https://github.com/DaftMonk/generator-angular-fullstack/issues/331)
* **build:** add gitter webhook for travis ([6b88efd](https://github.com/DaftMonk/generator-angular-fullstack/commit/6b88efd))
* **gen:** 
  * add README.md ([f07b09c](https://github.com/DaftMonk/generator-angular-fullstack/commit/f07b09c))
  * Remove global jQuery dependency ([a9230ca](https://github.com/DaftMonk/generator-angular-fullstack/commit/a9230ca)), closes [#547](https://github.com/DaftMonk/generator-angular-fullstack/issues/547)
  * unify testing framework ([654de87](https://github.com/DaftMonk/generator-angular-fullstack/commit/654de87))
  * use common endpoint templates for thing route ([6dc8130](https://github.com/DaftMonk/generator-angular-fullstack/commit/6dc8130))
* **generator:** use sauce labs for running e2e tests with travis CI ([50ca41d](https://github.com/DaftMonk/generator-angular-fullstack/commit/50ca41d)), closes [#572](https://github.com/DaftMonk/generator-angular-fullstack/issues/572)
* **model:** abstract model events to a standard EventEmitter ([91657d7](https://github.com/DaftMonk/generator-angular-fullstack/commit/91657d7)), closes [#857](https://github.com/DaftMonk/generator-angular-fullstack/issues/857) [#490](https://github.com/DaftMonk/generator-angular-fullstack/issues/490)
* **readme:** add david-dm badge & move badges to new line ([f8f32f4](https://github.com/DaftMonk/generator-angular-fullstack/commit/f8f32f4))
* **server:** 
  * add support for sequelize ([943120e](https://github.com/DaftMonk/generator-angular-fullstack/commit/943120e)), closes [#414](https://github.com/DaftMonk/generator-angular-fullstack/issues/414)
  * implement server-side ES6 via babel ([60334a8](https://github.com/DaftMonk/generator-angular-fullstack/commit/60334a8))
* **server-tests:** code coverage and e2e ([dbbaa20](https://github.com/DaftMonk/generator-angular-fullstack/commit/dbbaa20))
* **travis-ci:** enable container builds and caching ([00317a8](https://github.com/DaftMonk/generator-angular-fullstack/commit/00317a8))



<a name="2.0.13"></a>
## [2.0.13](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.12...v2.0.13) (2014-08-29)


### Bug Fixes

* **gen:** 
  * fix build when not selecting socket.io ([fdf063c](https://github.com/DaftMonk/generator-angular-fullstack/commit/fdf063c))
  * use bool for bootstrap filters ([a5decbc](https://github.com/DaftMonk/generator-angular-fullstack/commit/a5decbc)), closes [#496](https://github.com/DaftMonk/generator-angular-fullstack/issues/496)

### Features

* **auth:** make crypto async ([6aecdf7](https://github.com/DaftMonk/generator-angular-fullstack/commit/6aecdf7))



<a name="2.0.11"></a>
## [2.0.11](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.10...v2.0.11) (2014-08-26)


### Bug Fixes

* **app-config:** Use parentheses to fix string concat in config ([c6a50ce](https://github.com/DaftMonk/generator-angular-fullstack/commit/c6a50ce)), closes [#466](https://github.com/DaftMonk/generator-angular-fullstack/issues/466)
* **app-jshint:** improve jshint usage ([35fcf49](https://github.com/DaftMonk/generator-angular-fullstack/commit/35fcf49)), closes [#463](https://github.com/DaftMonk/generator-angular-fullstack/issues/463) [#486](https://github.com/DaftMonk/generator-angular-fullstack/issues/486)
* **gen:** use more restrictive version range for ng-component ([1969897](https://github.com/DaftMonk/generator-angular-fullstack/commit/1969897))

### Features

* **app-socket.io:** build socket.io into vendor.js ([06f2e46](https://github.com/DaftMonk/generator-angular-fullstack/commit/06f2e46))
* **docs:** Inform users/developers of the `canary` branch ([7469362](https://github.com/DaftMonk/generator-angular-fullstack/commit/7469362))
* **gen:** make generator tests faster, and easier to run ([84acb74](https://github.com/DaftMonk/generator-angular-fullstack/commit/84acb74))
* **gen-travis:** add additional node version to travis.yml ([e4f00b0](https://github.com/DaftMonk/generator-angular-fullstack/commit/e4f00b0))



<a name="2.0.10"></a>
## [2.0.10](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.9...v2.0.10) (2014-08-16)


### Bug Fixes

* **server:** undefined domain env variable causing issues ([cb683dd](https://github.com/DaftMonk/generator-angular-fullstack/commit/cb683dd))



<a name="2.0.9"></a>
## [2.0.9](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.8...v2.0.9) (2014-08-16)


### Bug Fixes

* **app:** 
  * add .idea folder to gitignore ([2e1f118](https://github.com/DaftMonk/generator-angular-fullstack/commit/2e1f118))
  * save the version of the generator that was used ([2b76b17](https://github.com/DaftMonk/generator-angular-fullstack/commit/2b76b17))
* **app:api:user:** Missing user response code ([c176660](https://github.com/DaftMonk/generator-angular-fullstack/commit/c176660)), closes [#438](https://github.com/DaftMonk/generator-angular-fullstack/issues/438)
* **gen:app:socket:** use `''` instead `null` as URL to open ioSocket ([0f0d0fd](https://github.com/DaftMonk/generator-angular-fullstack/commit/0f0d0fd))
* **gruntfile:** incorrect path to index.html for cdnify ([0ad646c](https://github.com/DaftMonk/generator-angular-fullstack/commit/0ad646c))
* **openshift:** fix issues with openshift deployment ([ace0723](https://github.com/DaftMonk/generator-angular-fullstack/commit/ace0723))

### Features

* **gen:** add automatic demo releases with grunt task ([4485223](https://github.com/DaftMonk/generator-angular-fullstack/commit/4485223))
* **server:** add sample env config file that can be tracked by git ([c9f80bc](https://github.com/DaftMonk/generator-angular-fullstack/commit/c9f80bc))
* **uibootstrap-modal:** add basic modal service and template when using uibootstrap ([7c14bed](https://github.com/DaftMonk/generator-angular-fullstack/commit/7c14bed))



<a name="2.0.8"></a>
## [2.0.8](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.7...v2.0.8) (2014-07-31)


### Bug Fixes

* **coffee:** update socket service to match javascript version ([c27cefe](https://github.com/DaftMonk/generator-angular-fullstack/commit/c27cefe))
* **gen:** Fixed missing `oauth` property in `.yo-rc.json` after 2.0.5 update ([11d324b](https://github.com/DaftMonk/generator-angular-fullstack/commit/11d324b))
* **travis:** install sass gem if sass is enabled ([ceeac27](https://github.com/DaftMonk/generator-angular-fullstack/commit/ceeac27))
* **twitter:** revert mongoose connection change ([8675a00](https://github.com/DaftMonk/generator-angular-fullstack/commit/8675a00))

### Features

* **user-management:** use the User $resource to populate users for the admin page ([708f072](https://github.com/DaftMonk/generator-angular-fullstack/commit/708f072))



<a name="2.0.7"></a>
## [2.0.7](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.6...v2.0.7) (2014-07-28)


### Bug Fixes

* **gruntfile:** grunt tasks should run if no local config exists ([422d6bc](https://github.com/DaftMonk/generator-angular-fullstack/commit/422d6bc))
* **server:** fix setting TTL index on collection : sessions error ([0581ed0](https://github.com/DaftMonk/generator-angular-fullstack/commit/0581ed0))



<a name="2.0.6"></a>
## [2.0.6](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.5...v2.0.6) (2014-07-27)


### Bug Fixes

* **app-dependency:** change ngmin to ng-annotate ([dd023fa](https://github.com/DaftMonk/generator-angular-fullstack/commit/dd023fa))
* **bootstrap:** removed styles breaking responsiveness for high-res screens ([053fedb](https://github.com/DaftMonk/generator-angular-fullstack/commit/053fedb))
* **responsive:** `things` made a little bit more responsive ([58aa7a4](https://github.com/DaftMonk/generator-angular-fullstack/commit/58aa7a4))
* **socketio:** fallback for servers where `socket.handshake.address` is not provided ([f6a1934](https://github.com/DaftMonk/generator-angular-fullstack/commit/f6a1934))
* **stylus:** remove bootstrap css import in stylus when bootstrap is not selected ([f7c3d0a](https://github.com/DaftMonk/generator-angular-fullstack/commit/f7c3d0a)), closes [#368](https://github.com/DaftMonk/generator-angular-fullstack/issues/368)

### Features

* **heroku:** provide prompt to set the deployment region ([13cd5e7](https://github.com/DaftMonk/generator-angular-fullstack/commit/13cd5e7))
* **oauth:** multiple strategies per account; changeable email ([ef06272](https://github.com/DaftMonk/generator-angular-fullstack/commit/ef06272))



<a name="2.0.5"></a>
## [2.0.5](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.4...v2.0.5) (2014-07-18)


### Bug Fixes

* **account:** add authentication requirement for settings view ([9105c0f](https://github.com/DaftMonk/generator-angular-fullstack/commit/9105c0f)), closes [#327](https://github.com/DaftMonk/generator-angular-fullstack/issues/327)
* **app:** 
  * bootstrap glyphicons not correctly linked on grunt build ([53d193d](https://github.com/DaftMonk/generator-angular-fullstack/commit/53d193d)), closes [#333](https://github.com/DaftMonk/generator-angular-fullstack/issues/333)
  * wait for currentUser to resolve before checking if logged in on route changes ([6d6090d](https://github.com/DaftMonk/generator-angular-fullstack/commit/6d6090d)), closes [#306](https://github.com/DaftMonk/generator-angular-fullstack/issues/306) [#294](https://github.com/DaftMonk/generator-angular-fullstack/issues/294)
* **app:server:thing.controller:** missing `res` param for handleError added ([eb7d50c](https://github.com/DaftMonk/generator-angular-fullstack/commit/eb7d50c))
* **app:styles:** use correct path for font awesome and glyphicons ([1917ba3](https://github.com/DaftMonk/generator-angular-fullstack/commit/1917ba3))
* **dependencies:** include certain dependencies only when answering yes to their respective prompts ([040c57d](https://github.com/DaftMonk/generator-angular-fullstack/commit/040c57d))
* **server:** 
  * fix seeding of db in test mode causing tests to randomly fail ([05f7f43](https://github.com/DaftMonk/generator-angular-fullstack/commit/05f7f43)), closes [#352](https://github.com/DaftMonk/generator-angular-fullstack/issues/352)
  * make user tests run more consistently ([addb506](https://github.com/DaftMonk/generator-angular-fullstack/commit/addb506)), closes [#346](https://github.com/DaftMonk/generator-angular-fullstack/issues/346)

### Features

* **app:** added oath buttons to signup page ([a408f58](https://github.com/DaftMonk/generator-angular-fullstack/commit/a408f58))
* **gen:** 
  * Generate CSS from Stylus ([1b90c44](https://github.com/DaftMonk/generator-angular-fullstack/commit/1b90c44))
  * Generate CSS from Stylus ([9d87a2c](https://github.com/DaftMonk/generator-angular-fullstack/commit/9d87a2c))
* **oauth:** remove code according to user prompts ([316bd9d](https://github.com/DaftMonk/generator-angular-fullstack/commit/316bd9d))



<a name="2.0.4"></a>
## [2.0.4](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.3...v2.0.4) (2014-07-09)


### Bug Fixes

* **app:** fix dependency injection minsafe problem in auth service ([03742a8](https://github.com/DaftMonk/generator-angular-fullstack/commit/03742a8))
* **gen:** heroku and openshift generators requiring .yo-rc file to work ([88ebfc8](https://github.com/DaftMonk/generator-angular-fullstack/commit/88ebfc8)), closes [#318](https://github.com/DaftMonk/generator-angular-fullstack/issues/318)



<a name="2.0.3"></a>
## [2.0.3](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.2...v2.0.3) (2014-07-04)


### Bug Fixes

* **server:** only enable sessions if twitter oauth was selected ([bcd00dc](https://github.com/DaftMonk/generator-angular-fullstack/commit/bcd00dc))

### Features

* **gen:** make bootstrap and bootstrap ui optional ([f50d094](https://github.com/DaftMonk/generator-angular-fullstack/commit/f50d094))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.1...v2.0.2) (2014-07-03)


### Bug Fixes

* **gen:endpoint:** 
  * fix endpoint spec not adjusting from route url ([163cacf](https://github.com/DaftMonk/generator-angular-fullstack/commit/163cacf)), closes [#298](https://github.com/DaftMonk/generator-angular-fullstack/issues/298)
  * fix some urls failing for api creation ([3fe80bd](https://github.com/DaftMonk/generator-angular-fullstack/commit/3fe80bd))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/DaftMonk/generator-angular-fullstack/compare/v2.0.0...v2.0.1) (2014-07-02)


### Bug Fixes

* **server:** local env not being copied ([f65b393](https://github.com/DaftMonk/generator-angular-fullstack/commit/f65b393))


    
<a name="v2.0.0"></a>
## v2.0.0 (2014-07-02)

#### Features

* **app:**
    * Follow googles AngularJS project recommendations to make a very modular app structure.
    * New look for generated app
    * Add basic crud interface to app
    * Support for UI Router
    * Support for LESS
    * Built in support for protractor e2e tests
    * Add angular-bootstrap and lodash to default app
    * More consistent and understandable naming conventions for files
* **server:**
    * Modular project structure for express server
    * Support for social auths with facebook/twitter/google
    * Role based authentication
    * Replace session based authentication with JWT authentication
    * Optional integration with socket.io
    * Added config file, ignored by git, for setting local environment variables, api keys, secrets.. etc.
* **gruntfile:**
    * Optimizations to the gruntfile
    * Automate injection of new scripts into index file with grunt
    * Use ng-templates to concatenate all the html/jade views into the javascript payload
* **gen:**
    * Abstract client-side generators into generator-ng-component, use new composition feature of yeoman to keep them available in the generator.
    * Add useful tests to the generator, start using travis CI
    * use .yo-rc file to keep track of generated configurations
    * Add endpoint generator to angular-fullstack, generates model / route / controller / test / socket updates

#### Breaking Changes
 * New project structure
 * Deprecated value and constant sub generators 
 * Sub-generators generate components in a single directory and don't inject themselves into the index file (this is done by a grunt task now)

<a name="v1.4.3"></a>
### v1.4.3 (2014-05-25)


#### Bug Fixes

* **config:** fix issue where `config.ip` is undefined in non-production environments ([087f5bca](http://github.com/DaftMonk/generator-angular-fullstack/commit/087f5bca1610e8250de50ce11a16e879908e3177))
* **package:** update connect-mongo to correct version
* **app:** add require attribute to login.html inputs so it validates on client side
* **gen:** use lowercase filenames for scripts

<a name="v1.4.2"></a>
### v1.4.2 (2014-04-16)


#### Bug Fixes

* **gen:** typo in heroku generator was preventing it from working on unix based systems ([9d3b5738](http://github.com/DaftMonk/generator-angular-fullstack/commit/9d3b5738528497f74d37d22c304b0d46cd5007fa))

<a name="v1.4.1"></a>
### v1.4.1 (2014-04-15)


#### Bug Fixes

* **server:** 
  * grunt test was incorrectly using dev config, fixes #179 ([62d8492f](http://github.com/DaftMonk/generator-angular-fullstack/commit/62d8492fd9fcfde653bab0f65b46f9961b8016bc))
  * emails are no longer case sensitive ([dafd8db1](https://github.com/DaftMonk/generator-angular-fullstack/commit/dafd8db1f529b86322ef60f65897761cef92841a))

<a name="v1.4.0"></a>
## v1.4.0 (2014-04-13)

#### Features

* **server:** updated Express to v4.x
* **app:** matching angular dependencies to the latest verison, now that bower excludes pre-releases ([94c0c636](http://github.com/DaftMonk/generator-angular-fullstack/commit/94c0c63691976eaf7136c33365f611b465ba7f61))
* **gen:** 
  * Added `angular-fullstack:openshift` generator, for deploying your app to OpenShift
  * Added `angular-fullstack:heroku` generator, which improves upon the former `:deploy` generator for deploying to Heroku

#### Bug Fixes

* **server:** fixed possible DB flushing when mochaTest is called by watch, first call 'env:test' task before 'mochaTest'
([2f0320fe](http://github.com/DaftMonk/generator-angular-fullstack/commit/2f0320feb89f3a5f1757f8adcae4b8c0d5599c95))

#### Breaking Changes

* The `angular-fullstack:deploy` generator is deprecated. Instead use `angular-fullstack:heroku` or `angular-fullstack:openshift`.

<a name="v1.3.3"></a>
### v1.3.3 (2014-03-29)

#### Features

* **server:** enable response compression ([1547ac6f](http://github.com/DaftMonk/generator-angular-fullstack/commit/1547ac6f794ce06d2a9329531bec5dae73441f04))

#### Bug Fixes

* **config:** change default port in config to 9000 ([480515f6](http://github.com/DaftMonk/generator-angular-fullstack/commit/480515f6cc8d7600003a570f9b1f0530fd178ac5))
* **gruntfile:**
  * update gruntfile to use port from config ([c8aa2d5f](http://github.com/DaftMonk/generator-angular-fullstack/commit/c8aa2d5feda90a2c1e7528165b1bd22e9eab5e77))
  * workaround imagemin bug by disabling caching ([3e435fa7](http://github.com/DaftMonk/generator-angular-fullstack/commit/3e435fa74b1574223f129867621a9a800cea2af9))
* **package:** update required generator-karma dependency to the correct version ([0c0e8a52](http://github.com/DaftMonk/generator-angular-fullstack/commit/0c0e8a522ffa94ea0bd9c0df9994c23340a957f7))

<a name="v1.3.2"></a>
### v1.3.2 (2014-03-01)


#### Bug Fixes

* **package.json:** updated dependencies that were causing issues with npm install ([1874cdf1](http://github.com/DaftMonk/generator-angular-fullstack/commit/1874cdf16c9d1670d0492db8db1be77e43222de4))

<a name="v1.3.1"></a>
### v1.3.1 (2014-03-01)


#### Bug Fixes

* **gruntfile:** configured jshint for client tests ([4ee92b9a](http://github.com/DaftMonk/generator-angular-fullstack/commit/4ee92b9a4c466982b171bc777c3ba6ba5a477633))

<a name="v1.3.0"></a>
## v1.3.0 (2014-02-27)


#### Bug Fixes

* **grunt:**
  * fixed clean:dist task ([e390cac0](http://github.com/DaftMonk/generator-angular-fullstack/commit/e390cac015974f691ab51261128b4215e878b25f))
* **server:**
  * config all and env specific are now correctly deep merged ([31039872](http://github.com/DaftMonk/generator-angular-fullstack/commit/31039872caec541847cb80da8edf3c7ffd83ef48))
  * fix configuration so that (express) errorHandler works ([0116cb35](http://github.com/DaftMonk/generator-angular-fullstack/commit/0116cb35524afb2ee5b8a599f6bc76dbe04febc5))


#### Features

* **app:**
  * added `grunt serve:debug` task that launches the server with a node-inspector tab ([de3e7a8b](http://github.com/DaftMonk/generator-angular-fullstack/commit/de3e7a8b7e63c54090c8fbc2f51998965b2e274f))
  * update to bootstrap sass official ([3799c13c](http://github.com/DaftMonk/generator-angular-fullstack/commit/3799c13c3b65fcc2abfbacb5292b192543558d52))
* **server:**
  * added tests for user model ([4c894b65](http://github.com/DaftMonk/generator-angular-fullstack/commit/4c894b65ec6a6d8de2b7290521f25b134ac30f40))
  * added mocha test configuration ([458a2f6a](http://github.com/DaftMonk/generator-angular-fullstack/commit/458a2f6a28485a8791815f8795e726af3c308efe))

<a name="v1.2.7"></a>
### v1.2.7 (2014-02-15)


#### Features

* **server:** undefined api routes now return a 404 ([ec829fe2](http://github.com/DaftMonk/generator-angular-fullstack/commit/ec829fe2221dbe001c12983c95576c20f0e63a30))

<a name="v1.2.6"></a>
### v1.2.6 (2014-02-14)


#### Bug Fixes

* **app:**
  * redirect to login only on 401s ([64b7bace](http://github.com/DaftMonk/generator-angular-fullstack/commit/64b7bacea98e59cb72a44627b57ca331d9bf051d))
  * fixed incorrect css path for usemin in gruntfile ([46fca240](http://github.com/DaftMonk/generator-angular-fullstack/commit/46fca240009d2c61aa07b5cef2275e4095033a10))
* **grunt:** include partial sub-directories in htmlmin ([77564ba3](http://github.com/DaftMonk/generator-angular-fullstack/commit/77564ba3b59baa52546f3b1170ee9cad16b7d413))
* **server:**
  * fixed connect-mongo error ([c12db5b3](http://github.com/DaftMonk/generator-angular-fullstack/commit/c12db5b3e9b7475ba4581f23f9c20e4ce701b855))
  * livereload now waits for server to finish restarting ([71d63f0a](http://github.com/DaftMonk/generator-angular-fullstack/commit/71d63f0a704a2773cee368b1af24c188e04d0ae3))
  * exposed configured passport from passport module ([772133de](http://github.com/DaftMonk/generator-angular-fullstack/commit/772133de1f86c8a6a8c93179673deb4359e30c94))
  * only require models if they are coffescript or js files ([ce2ee236](http://github.com/DaftMonk/generator-angular-fullstack/commit/ce2ee2369ff0c4aedc1a13d04359d918ea1b3d8d))


#### Features

* **deps:** upgrade angular to 1.2.11, and jquery to 1.11.0 ([cd5c3030](http://github.com/DaftMonk/generator-angular-fullstack/commit/cd5c303023f57de423ca69067b1105db17d066e3))
* **app:** switched sass-bootstrap to offical bootstrap-sass ([024fee88](http://github.com/DaftMonk/generator-angular-fullstack/commit/024fee8831c4a32962283878b6b9dbd444874ec0))

<a name="v1.2.5"></a>
### v1.2.5 (2014-01-27)


#### Bug Fixes

* **app:**
  * fixed coffee service so it's min-safe ([c18c9da4](http://github.com/DaftMonk/generator-angular-fullstack/commit/c18c9da4475e8e48507746f441186edf9fde18b1))
  * fixed bootstrap css being imported rather than compass bootstrap ([f2739987](http://github.com/DaftMonk/generator-angular-fullstack/commit/f27399879e84daf7230d9cd953c19e93bcd22746))
* **server:** 
  * replaced deprecated bodyparser ([788fda04](http://github.com/DaftMonk/generator-angular-fullstack/commit/788fda04ebd1ed7d24190aacda44c252fd1ae002))  
  * updated node version dependency ([b19a0997](http://github.com/DaftMonk/generator-angular-fullstack/commit/b19a0997c6db08a47a56069621756129e07c5915))   
* **gen:** updated generator dependencies ([115008d3](http://github.com/DaftMonk/generator-angular-fullstack/commit/115008d378a9fd9cc47561f451cd9153f4f2c566)) 

<a name="v1.2.4"></a>
### v1.2.4 (2014-01-16)


#### Bug Fixes

* **grunt:** fixed incorrect templating expression ([2a59e070](http://github.com/DaftMonk/generator-angular-fullstack/commit/2a59e070bb89abb4ea83e165f8a29b8de94621f1))

<a name="v1.2.3"></a>
### v1.2.3 (2014-01-16)


#### Bug Fixes

* **app:** fixed jshint warning in user model ([f668fdc7](http://github.com/DaftMonk/generator-angular-fullstack/commit/f668fdc7f798e2656a9576f249836f7c91d27f1a))

<a name="v1.2.2"></a>
### v1.2.2 (2014-01-16)


#### Bug Fixes

* **app:**
  * replaced bcrypt with crypto for windows users ([af20c3ab](http://github.com/DaftMonk/generator-angular-fullstack/commit/af20c3ab6fd63e41475175e333810d09b3e9c3ea))
  * added karma dependencies directly to package template ([13ea60e7](http://github.com/DaftMonk/generator-angular-fullstack/commit/13ea60e7ec5763fb7f96900464df1bf26ee6912c))

<a name="v1.2.1"></a>
### v1.2.1 (2014-01-12)

<a name="v1.2.0"></a>
## v1.2.0 (2014-01-11)

#### Features

* **app:**
  * restructured project for easier configuration ([0a2bf2ab](http://github.com/DaftMonk/generator-angular-fullstack/commit/0a2bf2abe04de834c786402b8945d247b4f951aa))
  * grunt build now moves all files into dist folder ([e6eff5d5](http://github.com/DaftMonk/generator-angular-fullstack/commit/e6eff5d56bf2a784feb3de6218e74b5390df319f))
* **server:** added jshint error checking before livereload occurs ([7e001d31](http://github.com/DaftMonk/generator-angular-fullstack/commit/7e001d3156d778022e7b6847cc65934432fb9200))
* **gen:** added passport question for scaffolding out user account creation ([87841064](http://github.com/DaftMonk/generator-angular-fullstack/commit/8784106409e51cddf8fcdc6ab52b1e81137cda19))
   
#### Bug Fixes

* **app:** removed async dependency ([d5636d71](http://github.com/DaftMonk/generator-angular-fullstack/commit/d5636d712a984948fb92b82794681c07d43d830d))
* **gitignore:** fix app/views being ignored by git ([7fa82ff9](http://github.com/DaftMonk/generator-angular-fullstack/commit/7fa82ff953e9f1368b8f9d6c3dadb5fe83bec002))
* **server:**
  * config wasn't added to default project ([79c5e027](http://github.com/DaftMonk/generator-angular-fullstack/commit/79c5e027719507a74497c2f6be77375a513316c4))
  * removed typo and cleaned up extra whitespace ([1a132c28](http://github.com/DaftMonk/generator-angular-fullstack/commit/1a132c2822fd4973068b8beae075d0c8ec3efd42))
  * fixed style issues that were tripping up jshint

#### Breaking Changes

* `grunt heroku` is deprecated. Use `grunt build` instead.

<a name="v1.1.1"></a>
### v1.1.1 (2013-12-25)

#### Bug Fixes 

* **views:**
  * Replaced deprecated jade tags.

#### Features

* **app:**
  * Updgrade to AngularJS 1.2.6

<a name="v1.1.0"></a>
## v1.1.0 (2013-12-22)


#### Bug Fixes

* **app:**
  * only copy CSS if Compass is not installed ([7e586745](http://github.com/DaftMonk/generator-angular-fullstack/commit/7e58674585e138c0f2eb81f46ef2cc4f1b9a3bf8))
  * services use classified names ([56a71a83](http://github.com/DaftMonk/generator-angular-fullstack/commit/56a71a83cdf90f81bb37b422ba4d40e75d28e1fe), closes [#484](http://github.com/DaftMonk/generator-angular-fullstack/issues/484))
  * reload JS files in watch ([d20f5bd2](http://github.com/DaftMonk/generator-angular-fullstack/commit/d20f5bd20ba95d47447f8acceee491a0a0ba9724))
* **build:** deselecting ngRoute does remove route stuff ([a358c1ae](http://github.com/DaftMonk/generator-angular-fullstack/commit/a358c1ae69bff6a7708ea0a77248698f931f2e4d), closes [#486](http://github.com/DaftMonk/generator-angular-fullstack/issues/486))
* **gen:**
  * updated all conflicts, and fixed some bugs, from merging with upstream ([d07c829d](http://github.com/DaftMonk/generator-angular-fullstack/commit/d07c829db283eaa4986774f9664243b50b3b5171))
  * fix bower install prompt during project gen ([706f1336](http://github.com/DaftMonk/generator-angular-fullstack/commit/706f1336852923e409d669ae6fc6faeda7bbb017), closes [#505](http://github.com/DaftMonk/generator-angular-fullstack/issues/505))
* **package:** fix imagemin for windows users ([b3cec228](http://github.com/DaftMonk/generator-angular-fullstack/commit/b3cec228b4354343929ca07fd7225526cdab74d9))
* **views:**
  * fix ng includes ([598c69a5](http://github.com/DaftMonk/generator-angular-fullstack/commit/598c69a594e00f598e0cbd435444bc8abaa0d4ee))
  * add compiled views to gitignore ([087ede5f](http://github.com/DaftMonk/generator-angular-fullstack/commit/087ede5f8e2cef4c49f940ef922d71a51d110d51))
  * fix incorrect build path for vendor css ([0ed2a200](http://github.com/DaftMonk/generator-angular-fullstack/commit/0ed2a20018086fa514846ad2503841f6d5b23e16))


#### Features

* **app:**
  * add jasmine browser global to test jshintrc ([11b6ed42](http://github.com/DaftMonk/generator-angular-fullstack/commit/11b6ed42b5e941f25cc305eb5c4e8ba49586cf64))
  * use lowercase file names ([23e5d772](http://github.com/DaftMonk/generator-angular-fullstack/commit/23e5d7724e7e02e4b974f4e804f35eca33a53aea), closes [#463](http://github.com/DaftMonk/generator-angular-fullstack/issues/463))
  * use htmlmin for smaller HTML files ([2b85a52a](http://github.com/DaftMonk/generator-angular-fullstack/commit/2b85a52a054ac8cf1ab86ce1cd3de7819d30ea52), closes [#469](http://github.com/DaftMonk/generator-angular-fullstack/issues/469))
  * use grunt-bower-install for dep management ([ba7b5051](http://github.com/DaftMonk/generator-angular-fullstack/commit/ba7b505117307059a6d013d838c8aeff6db0e452), closes [#497](http://github.com/DaftMonk/generator-angular-fullstack/issues/497))
  * Enable Node debug mode ([83ae4a9e](http://github.com/DaftMonk/generator-angular-fullstack/commit/83ae4a9e328a388dd61414634ca5e10c8a0c819b))
* **gen:**
  * Added navbar to starting template ([b5e94749](http://github.com/DaftMonk/generator-angular-fullstack/commit/b5e94749384ab9a3305991df62d7ed9856bded83))
  * additional work for compass support ([11cb9943](http://github.com/DaftMonk/generator-angular-fullstack/commit/11cb99437271b6e8f6cdaee8fd5fc9cda7a20d1d))
  * add Compass support to the initialization process ([7fac1194](http://github.com/DaftMonk/generator-angular-fullstack/commit/7fac1194179df3181f52258b0aa7333799fec253))
  * add welcome message and dep notice for minsafe ([f0bb8da2](http://github.com/DaftMonk/generator-angular-fullstack/commit/f0bb8da2d67c3f627bf775e2d4f53340b5c980c4), closes [#452](http://github.com/DaftMonk/generator-angular-fullstack/issues/452))
* **server:** 
  * Added middleware for development mode that disables caching of script files ([c082c81c](http://github.com/DaftMonk/generator-angular-fullstack/commit/c082c81c21a9d8d6fd9fccd5001270759fb2a30f))
  * Moved express configuration code out of server.js and into config folder to make it a more high level bootstrap.


#### Breaking Changes

* Deselecting ngRoute adds controller and
ng-include to index.html
 ([a358c1ae](http://github.com/DaftMonk/generator-angular-fullstack/commit/a358c1ae69bff6a7708ea0a77248698f931f2e4d))
* `--minsafe` flag is now deprecated. 
* `grunt server` is now deprecated. Use `grunt serve` instead

<a name="v1.0.1"></a>
### v1.0.1 (2013-11-27)


#### Bug Fixes

* **coffee:** updated coffescript templates to point to partials ([f98e84ef](http://github.com/DaftMonk/generator-angular-fullstack/commit/f98e84efdd88243cff1ea449dc3a8e9dbebb7ccc))

<a name="v1.0.0"></a>
## v1.0.0 (2013-11-26)


#### Bug Fixes

* **build:**
  * use test-specifc jshintrc ([c00c091b](http://github.com/DaftMonk/generator-angular-fullstack/commit/c00c091bdca2b55685d81a2b84b002d73aacbdcc))
  * add webapp upstream features and better coffee ([c23acebb](http://github.com/DaftMonk/generator-angular-fullstack/commit/c23acebbd8fabd391bfeee0d424f26e59f756a03))
  * use grunt-newer for styles and jshint ([b1eeb68a](http://github.com/DaftMonk/generator-angular-fullstack/commit/b1eeb68a8290aee930887fc473034ee7f8e2ccc3))
  * standardize comments and comment out uglify:dist ([d5d3e458](http://github.com/DaftMonk/generator-angular-fullstack/commit/d5d3e458e70d054707c70d058454fdd3d94070fe), closes [#455](http://github.com/DaftMonk/generator-angular-fullstack/issues/455))
* **deps:** upgrade dependencies ([3a57216f](http://github.com/DaftMonk/generator-angular-fullstack/commit/3a57216ff9e3192db3804634f360253e9fcce69d))
* **gen:**
  * Fixed jshint errors that were breaking grunt task ([c6ae81c8](http://github.com/DaftMonk/generator-angular-fullstack/commit/c6ae81c8110ee59c9099740ea2f90b0d08b810d3))

#### Features

* **app:**
  * Separate client and server watchers ([0ff8ffb1](http://github.com/DaftMonk/generator-angular-fullstack/commit/0ff8ffb105a2eb1cd079fabafc5a6517d62e861d))
  * imagemin handles gifs ([9341eb9b](http://github.com/DaftMonk/generator-angular-fullstack/commit/9341eb9b710b95c95407dc54ed4af6aa4a496426))
* **gen:**
  * added support for jade templates ([24a13bfe](http://github.com/DaftMonk/generator-angular-fullstack/commit/24a13bfea0e4a9633f33e37df4a4710fecdea937))
  * Support for server rendering and Angular's HTML5 mode ([5ccdeb7a](http://github.com/DaftMonk/generator-angular-fullstack/commit/5ccdeb7a5543e35c000a54dfc15289004e406866), closes [#18](http://github.com/DaftMonk/generator-angular-fullstack/issues/18), [#17](http://github.com/DaftMonk/generator-angular-fullstack/issues/17))
  * add image file as example ([b161c298](http://github.com/DaftMonk/generator-angular-fullstack/commit/b161c2982d86df1bb3de44cd9fa8aee05fc66ff3))
* **build:**
  * compile only changed coffeescript files in watch task ([4196e379](http://github.com/DaftMonk/generator-angular-fullstack/commit/4196e37912993ae37812fa19d9378d8b8d2cc9da), closes [#425](http://github.com/DaftMonk/generator-angular-fullstack/issues/425))
  * deprecate server in favor of serve ([ef056319](http://github.com/DaftMonk/generator-angular-fullstack/commit/ef0563192a9e3fc834ae97e7ec68470bcfdf56eb))

#### Breaking Changes

* `angular-fullstack:route`
* `angular-fullstack:view`

Will now generate views and routes in the views/partials folder.

**For existing projects:**

For generating routes and views, install generator-angular and use     it's sub-generators. 

They are exactly the same as the generators that you have been using. Example usage: `yo angular:route helloworld`.

**For New projects:**

Continue to use angular-fullstack route and view sub-generators.

The reason for this change in folder structure was to support server page rendering.


Closes #18, #17
 ([5ccdeb7a](http://github.com/DaftMonk/generator-angular-fullstack/commit/5ccdeb7a5543e35c000a54dfc15289004e406866))

* `grunt server` is being deprecated
 ([ef056319](http://github.com/DaftMonk/generator-angular-fullstack/commit/ef0563192a9e3fc834ae97e7ec68470bcfdf56eb))

<a name="v0.2.0"></a>
## v0.2.0 (2013-11-13)


#### Bug Fixes

* **bootstrap:** some plugins have ordering dependencies ([3da4a130](http://github.com/DaftMonk/generator-angular-fullstack/commit/3da4a1301e0b744c7a6054fafff26fff16b6442b))
* **build:** only include sass if sass is selected ([597b8b5c](http://github.com/DaftMonk/generator-angular-fullstack/commit/597b8b5cfab77b78e7f6091140beda2eeee0ed54), closes [#449](http://github.com/DaftMonk/generator-angular-fullstack/issues/449))
* **css:** remove merge conflicts ([d558af35](http://github.com/DaftMonk/generator-angular-fullstack/commit/d558af351c8a531132ce064a461bc038e0710b25))
* **gen:**
  * script paths use forward slashes ([40aa61dc](http://github.com/DaftMonk/generator-angular-fullstack/commit/40aa61dcc1bf31918bea3d2ce9a84c93554aa64a), closes [#410](http://github.com/DaftMonk/generator-angular-fullstack/issues/410))
  * remove extra "App" from service spec files ([4053f11f](http://github.com/DaftMonk/generator-angular-fullstack/commit/4053f11f800280569f5b7396ad015f0a6bcc7b49))
  * options should have descriptions ([da001832](http://github.com/DaftMonk/generator-angular-fullstack/commit/da001832dbdb268b3bf38f359c72b40c401273e4))
* **styles:** update path to icon images ([8daad4f2](http://github.com/DaftMonk/generator-angular-fullstack/commit/8daad4f2de9dbde4fcc810527da7c9607e1db8d4))
* **template:** remove redundant closing tag ([d1e560e0](http://github.com/DaftMonk/generator-angular-fullstack/commit/d1e560e0675ecb70e6c4b59cf4de9df461434a31), closes [#441](http://github.com/DaftMonk/generator-angular-fullstack/issues/441))


#### Features

* **app:**
  * run unit tests when test scripts are changed ([94af0b51](http://github.com/DaftMonk/generator-angular-fullstack/commit/94af0b510982b05c5a1939966e96aeccce087500))
  * update to angular 1.2.0 ([77082c6b](http://github.com/DaftMonk/generator-angular-fullstack/commit/77082c6b8d1dda76579f1970a270dffc359f027f))
  * reload grunt server when gruntfile is updated ([50c6abb9](http://github.com/DaftMonk/generator-angular-fullstack/commit/50c6abb9cce09a149253ceb8496feca813a71136))
  * upgrade to Bootstrap 3.0.1 ([59f4b1ba](http://github.com/DaftMonk/generator-angular-fullstack/commit/59f4b1ba73842b758174ad44a7da60af4f4db63f))
* **gen:**
  * allow app names to have custom suffix ([09f0f7b3](http://github.com/DaftMonk/generator-angular-fullstack/commit/09f0f7b3a8c3264b7527bc9fed8c709becec99eb))


<a name="v0.1.0"></a>
## v0.1.0 (2013-11-12)

#### Features

* **gen:** include MongoDB as an option When selected, sets up database with Mongoose. Repl ([280cc84d](http://github.com/DaftMonk/generator-angular-fullstack/commit/280cc84d735c60b1c261540dceda34dd7f91c93c), closes [#2](http://github.com/DaftMonk/generator-angular-fullstack/issues/2))
