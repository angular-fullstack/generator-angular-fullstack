### Route
Generates a new route.

Example:
```bash
yo angular-fullstack:route myroute
[?] What module name would you like to use? myApp
[?] Where would you like to create this route? client/app/
[?] What will the url of your route be? /myroute
```

Produces:

    client/app/myroute/myroute.js
    client/app/myroute/myroute.component.js
    client/app/myroute/myroute.component.spec.js
    client/app/myroute/myroute.html
    client/app/myroute/myroute.scss

Your new `myroute.component.js` will contain Angular code registering a new module, defaulting to `myApp.myRoute`. The default export of the component will be this name. Make sure to import this name in a parent Angular module, and add it as a dependency like so:

```js
import MyRouteModule from './myroute/myroute.component';

...

angular.module('myApp.myParent', [MyRouteModule]);
```
