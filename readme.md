# AngularJS Full-Stack generator
![generator-angular-fullstack](http://angular-fullstack.github.io/generator-angular-fullstack/angular-fullstack-logo.svg)

![Build Status](https://img.shields.io/circleci/project/angular-fullstack/generator-angular-fullstack/master.svg)
[![npm version](https://img.shields.io/npm/v/generator-angular-fullstack.svg)](https://www.npmjs.com/package/generator-angular-fullstack)
[![Dependency Status](https://img.shields.io/david/angular-fullstack/generator-angular-fullstack.svg)](https://david-dm.org/angular-fullstack/generator-angular-fullstack)
[![Dev-Dependency Status](https://img.shields.io/david/dev/angular-fullstack/generator-angular-fullstack.svg)](https://david-dm.org/angular-fullstack/generator-angular-fullstack#info=devDependencies)
[![Gitter chat](https://img.shields.io/gitter/room/DaftMonk/generator-angular-fullstack.svg)](https://gitter.im/DaftMonk/generator-angular-fullstack)
[![OpenCollective](https://opencollective.com/angular-fullstack/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/angular-fullstack/sponsors/badge.svg)](#sponsors)
> Yeoman generator for creating MEAN/SEAN stack applications, using ES6, MongoDB/SQL, Express, AngularJS, and Node - lets you quickly set up a project following best practices.



#### Generated project: 
[![Dependency Status](https://img.shields.io/david/angular-fullstack/angular-fullstack-deps.svg)](https://david-dm.org/angular-fullstack/angular-fullstack-deps)
[![Dev-Dependency Status](https://img.shields.io/david/dev/angular-fullstack/angular-fullstack-deps.svg)](https://david-dm.org/angular-fullstack/angular-fullstack-deps#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/package/npm/angular-fullstack-deps/badge.svg)](https://snyk.io/package/npm/angular-fullstack-deps)

## Usage

Install `yo`, `gulp-cli`, and `generator-angular-fullstack`:
```
npm install -g yo gulp-cli generator-angular-fullstack
```
__Please note__: If you run into trouble compiling native add-ons during the installation, follow [`node-gyp`](https://github.com/nodejs/node-gyp)'s short guide on [required compilation tools](https://github.com/nodejs/node-gyp#installation).

---

Run `yo angular-fullstack`
```
yo angular-fullstack
```

**See the [Getting Started](http://angular-fullstack.github.io/generator-angular-fullstack/Getting_Started/Prerequisites.html) guide for more information.**

## Prerequisites

* MongoDB - Download and Install [MongoDB](https://www.mongodb.com/download-center#community) - If you plan on scaffolding your project with mongoose, you'll need mongoDB to be installed and have the `mongod` process running.
* The project's JavaScript is written in ECMAScript 2015. If you're unfamiliar with the latest changes to the specification for JavaScript, check out http://es6-features.org/

## Supported Configurations

**General**

* Build Systems: `Gulp`
* Testing: 
  * `Jasmine`
  * `Mocha + Chai + Sinon`
    * Chai assertions:
      * `Expect`
      * `Should`

**Client**

* Scripts: `JavaScript (Babel)`, `TypeScript`
* Module Systems: `Webpack`, ~~`SystemJS + JSPM`~~ (maybe)
* Markup:  `HTML`, `Pug`
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
    * oAuth integrations: `Facebook`, `Twitter`, `Google`
    * Socket.io integration: `Yes`, `No`


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


## Documentation

Check out our [documentation home page](http://angular-fullstack.github.io/generator-angular-fullstack).


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

![generator-angular-fullstack](http://angular-fullstack.github.io/generator-angular-fullstack/angular-fullstack-boxes.svg)
