# AngularJS generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-angular.png?branch=master)](http://travis-ci.org/yeoman/generator-angular)

Maintainer: [Brian Ford](https://github.com/btford)

Based on [angular-seed](https://github.com/angular/angular-seed/)

Usage: `yeoman init angular`

Available generators:

* [angular:controller](#controller)
* [angular:directive](#directive)
* [angular:filter](#filter)
* [angular:route](#route)
* [angular:service](#service)
* [angular:view](#view)
* [angular:all](#all)

## Generators

### All
Sets up a new AngularJS project, generating all the boilerplate you need to get started.

Example:


### Route
Generates a controller and view, and configures a route in `app/scripts/app.js` connecting them.

### Controller
Generates a controller in `app/scripts/controller`.

Example:

### Directive
TODO

Example:

### Filter
Generates a filter in `app/scripts/filters`.

Example:
```bash
yeoman init angular:filter myFilter
```

Produces `app/scripts/filters/myFilter.js`:
```javascript
angular.module('myMod').filter('myFilter', function () {
  return function (input) {
    return 'myFilter filter:' + input;
  };
})
```

### View
Generates an HTML view file in `app/views`.

Example:
```bash
yeoman init angular:view user
```

Produces `app/views/user.html`:
```html
<p>This is the user view</p>
```

### Service
Generates an AngularJS service.

Example:
TODO

#### Options
There are options for each of the methods for registering services. For more on using these services, see the [module API AngularJS documentation](http://docs.angularjs.org/api/angular.Module).

##### Factory
`--factory`

This is the default method when creating... Calling `yeoman init angular:factory myService --factory`

##### Service
Invoked with `--service`

##### Value
Invoked with `--value`

##### Constant
Invoked with `--constant`

## Options
In general, these options can be applied to any generator, though they only affect generators that produce scripts.

### CoffeeScript
For generators that output scripts, the `--coffee` option will output CoffeeScript instead of JavaScript.

For example:
```bash
yeoman init angular:controller --coffee users
```

Produces `app/scripts/controller/users.coffee`:
```coffeescript
TODO
```

A project can mix CoffeScript and JavaScript files.

### Minification Safe
By default, generators produce unannotated code. Without annotations, AngularJS's DI system will break when minified. Typically, these annotations the make minification safe are added automatically at build-time, after application files are concatenated, but before they are minified. By providing the `--minsafe` option, the code generated will out-of-the-box be ready for minification. The trade-off is between amount of boilerplate, and build process complexity.

#### Example
```bash
yeoman init angular:controller users --minsafe
```

Produces `app/controller/users.coffee`:
```javascript
angular.module('myMod').controller('UsersCtrl', ['$scope', function ($scope) {
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

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
