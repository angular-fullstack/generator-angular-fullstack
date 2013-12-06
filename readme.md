# AngularJS generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-angular.png?branch=master)](http://travis-ci.org/yeoman/generator-angular)

Maintainer: [Brian Ford](https://github.com/btford)

Based on [angular-seed](https://github.com/angular/angular-seed/)


## Usage

Install `generator-angular`:
```
npm install -g generator-angular
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular`, optionally passing an app name:
```
yo angular [app-name]
```

Run `grunt` for building and `grunt serve` for preview


## Generators

Available generators:

* [angular](#app) (aka [angular:app](#app))
* [angular:controller](#controller)
* [angular:directive](#directive)
* [angular:filter](#filter)
* [angular:route](#route)
* [angular:service](#service)
* [angular:provider](#service)
* [angular:factory](#service)
* [angular:value](#service)
* [angular:constant](#service)
* [angular:decorator] (#decorator)
* [angular:view](#view)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also optionally installs Twitter Bootstrap and additional AngularJS modules, such as angular-resource (installed by default).

Example:
```bash
yo angular
```

### Route
Generates a controller and view, and configures a route in `app/scripts/app.js` connecting them.

Example:
```bash
yo angular:route myroute
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
yo angular:controller user
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
yo angular:directive myDirective
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
yo angular:filter myFilter
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
yo angular:view user
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

You can also do `yo angular:factory`, `yo angular:provider`, `yo angular:value`, and `yo angular:constant` for other types of services.

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo angular:decorator serviceName
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
yo angular:controller user --coffee
```

Produces `app/scripts/controller/user.coffee`:
```coffeescript
angular.module('myMod')
  .controller 'UserCtrl', ($scope) ->
```

A project can mix CoffeScript and JavaScript files.

To output JavaScript files, even if CoffeeScript files exist (the default is to output CoffeeScript files if the generator finds any in the project), use `--coffee=false`.

### Minification Safe

**Deprecated**

[Related Issue #452](https://github.com/yeoman/generator-angular/issues/452): This option is being removed in future versions of the generator. Initially it was needed as ngMin was not entirely stable. As it has matured, the need to keep separate versions of the script templates has led to extra complexity and maintenance of the generator. By removing these extra burdens, new features and bug fixes should be easier to implement. If you are dependent on this option, please take a look at ngMin and seriously consider implementing it in your own code. It will help reduce the amount of typing you have to do (and look through) as well as make your code cleaner to look at.


By default, generators produce unannotated code. Without annotations, AngularJS's DI system will break when minified. Typically, these annotations that make minification safe are added automatically at build-time, after application files are concatenated, but before they are minified. By providing the `--minsafe` option, the code generated will out-of-the-box be ready for minification. The trade-off is between amount of boilerplate, and build process complexity.

#### Example
```bash
yo angular:controller user --minsafe
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
yo angular:service serviceName --skip-add
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
