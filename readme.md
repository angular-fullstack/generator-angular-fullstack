# AngularJS + Express Full Stack Generator 

A generator for AngularJS, integrated with an Express `server.js` for full stack development. 

Featuring: 

 * Express server integrated with grunt tasks
 * Livereload of client and server files
 * Easy deployment workflow.
 * **NEW** Optional mongoDB integration

Based on [generator-angular](https://github.com/yeoman/generator-angular)


## Usage

Install `generator-angular-fullstack`:
```
npm install -g generator-angular-fullstack
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular-fullstack`, optionally passing an app name:
```
yo angular-fullstack [app-name]
```

### Express

Launch your express server in development mode.
```
grunt serv
``` 

Launch your express server in production mode, uses the minified/optimized production app folder.
```
grunt serv:dist
``` 

### Livereload

`grunt server` will watch client files in `app/`, and server files inside `lib/`, restarting the Express server when a change is detected.

### Deployment

While deployment should be easy enough with the `grunt dist` build, we provide an extremely simplifed deployment process for heroku.

`yo angular-fullstack:deploy heroku` for generating a deployment ready folder for [heroku.com](http://heroku.com/) from your project files. 

**Create and Deploy an app in 4 steps**

1. `mkdir foo && cd foo`

2. `yo angular-fullstack`

3. `yo angular-fullstack:deploy heroku`

4. `cd heroku && git push heroku master`

That's it! Your app should be live and shareable. Type `heroku open` to view it.  

## Generators

Available generators:

* [angular-fullstack](#app) (aka [angular-fullstack:app](#app))
* [angular-fullstack:controller](#controller)
* [angular-fullstack:directive](#directive)
* [angular-fullstack:filter](#filter)
* [angular-fullstack:route](#route)
* [angular-fullstack:service](#service)
* [angular-fullstack:provider](#service)
* [angular-fullstack:factory](#service)
* [angular-fullstack:value](#service)
* [angular-fullstack:constant](#service)
* [angular-fullstack:decorator](#decorator)
* [angular-fullstack:view](#view)
* [angular-fullstack:deploy](#deploy)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also optionally installs Twitter Bootstrap and additional AngularJS modules, such as angular-resource (installed by default).

Example:
```bash
yo angular-fullstack
```

### Deploy
Initalizes a heroku app and generates a `heroku` folder which is ready to push to heroku.

Example:
```bash
yo angular-fullstack:deploy heroku
```

### Route
Generates a controller and view, and configures a route in `app/scripts/app.js` connecting them.

Example:
```bash
yo angular-fullstack:route myroute
```

Produces `app/scripts/controllers/myroute.js`:
```javascript
angular.module('myMod').controller('MyrouteCtrl', function ($scope) {
  // ...
});
```

Produces `app/views/myroute.html`:
```html
<p>This is the myroute view</p>
```

### Controller
Generates a controller in `app/scripts/controllers`.

Example:
```bash
yo angular-fullstack:controller user
```

Produces `app/scripts/controllers/user.js`:
```javascript
angular.module('myMod').controller('UserCtrl', function ($scope) {
  // ...
});
```
### Directive
Generates a directive in `app/scripts/directives`.

Example:
```bash
yo angular-fullstack:directive myDirective
```

Produces `app/scripts/directives/myDirective.js`:
```javascript
angular.module('myMod').directive('myDirective', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      element.text('this is the myDirective directive');
    }
  };
});
```

### Filter
Generates a filter in `app/scripts/filters`.

Example:
```bash
yo angular-fullstack:filter myFilter
```

Produces `app/scripts/filters/myFilter.js`:
```javascript
angular.module('myMod').filter('myFilter', function () {
  return function (input) {
    return 'myFilter filter:' + input;
  };
});
```

### View
Generates an HTML view file in `app/views`.

Example:
```bash
yo angular-fullstack:view user
```

Produces `app/views/user.html`:
```html
<p>This is the user view</p>
```

### Service
Generates an AngularJS service.

Example:
```bash
yo angular:service myService
```

Produces `app/scripts/services/myService.js`:
```javascript
angular.module('myMod').service('myService', function () {
  // ...
});
```

You can also do `yo angular-fullstack:factory`, `yo angular-fullstack:provider`, `yo angular-fullstack:value`, and `yo angular-fullstack:constant` for other types of services.

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo angular-fullstack:decorator serviceName
```

Produces `app/scripts/decorators/serviceNameDecorator.js`:
```javascript
angular.module('myMod').config(function ($provide) {
    $provide.decorator('serviceName', function ($delegate) {
      // ...
      return $delegate;
    });
  });
```

## Options
In general, these options can be applied to any generator, though they only affect generators that produce scripts.

### CoffeeScript
For generators that output scripts, the `--coffee` option will output CoffeeScript instead of JavaScript.

For example:
```bash
yo angular-fullstack:controller user --coffee
```

Produces `app/scripts/controller/user.coffee`:
```coffeescript
angular.module('myMod')
  .controller 'UserCtrl', ($scope) ->
```

A project can mix CoffeScript and JavaScript files.

To output JavaScript files, even if CoffeeScript files exist (the default is to output CoffeeScript files if 
the generator finds any in the project), use `--coffee=false`.

### Minification Safe
By default, generators produce unannotated code. Without annotations, AngularJS's DI system will break when minified. Typically, these annotations that make minification safe are added automatically at build-time, after application files are concatenated, but before they are minified. By providing the `--minsafe` option, the code generated will out-of-the-box be ready for minification. The trade-off is between amount of boilerplate, and build process complexity.

#### Example
```bash
yo angular-fullstack:controller user --minsafe
```

Produces `app/controller/user.js`:
```javascript
angular.module('myMod').controller('UserCtrl', ['$scope', function ($scope) {
  // ...
}]);
```

#### Background
Unannotated:
```javascript
angular.module('myMod').controller('MyCtrl', function ($scope, $http, myService) {
  // ...
});
```

Annotated:
```javascript
angular.module('myMod').controller('MyCtrl',
  ['$scope', '$http', 'myService', function ($scope, $http, myService) {

    // ...
  }]);
```

The annotations are important because minified code will rename variables, making it impossible for AngularJS to infer module names based solely on function parameters.

The recommended build process uses `ngmin`, a tool that automatically adds these annotations. However, if you'd rather not use `ngmin`, you have to add these annotations manually yourself.

### Add to Index
By default, new scripts are added to the index.html file. However, this may not always be suitable. Some use cases:

* Manually added to the file
* Auto-added by a 3rd party plugin
* Using this generator as a subgenerator

To skip adding them to the index, pass in the skip-add argument:
```bash
yo angular-fullstack:service serviceName --skip-add
```

## Bower Components

The following packages are always installed by the [app](#app) generator:

* angular
* angular-mocks
* angular-scenario


The following additional modules are available as components on bower, and installable via `bower install`:

* angular-cookies
* angular-loader
* angular-resource
* angular-sanitize

All of these can be updated with `bower update` as new versions of AngularJS are released.

## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

### Output
You can change the `app` directory by adding a `appPath` property to `bower.json`. For instance, if you wanted to easily integrate with Express.js, you could add the following:

```json
{
  "name": "yo-test",
  "version": "0.0.0",
  ...
  "appPath": "public"
}

```
This will cause Yeoman-generated client-side files to be placed in `public`.

## Testing

Running `grunt test` will run the unit tests with karma.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a PR, make sure that the commit messages match the [AngularJS conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/).

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
