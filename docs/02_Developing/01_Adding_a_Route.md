# Adding a Route

Alright, now let's add another route to our app. We'll call it 'foo'. We can easily do this with the `yo angular-fullstack:route` subgenerator command:

```bash
$ yo angular-fullstack:route foo
? What module name would you like to use? (aftestApp.foo)
? What module name would you like to use? aftestApp.foo
? Where would you like to create this route? (client/app/)
? Where would you like to create this route? client/app/
? What will the url of your route be? (/foo)
? What will the url of your route be? /foo
identical client\app\foo\foo.routes.js
identical client\app\foo\foo.component.js
identical client\app\foo\foo.component.spec.js
identical client\app\foo\foo.html
identical client\app\foo\foo.scss

In the parent of this component, you should now import this component and add it as a dependency:

    import FooComponent from './foo/foo.component';
    ...
    export angular.module('myParentModule', [FooComponent]);
```

We give it our route name ('foo'), and a few more details: the name of the Angular module to create ('myApp.foo'), which folder to put the route under ('client/app/foo/'), and the URL of the route ('localhost:3000/foo').

This will create an Angular 1.5 component with an Angular module (`foo.component.js`), a template file (`foo.html`), a CSS file (`foo.scss`), a unit test file (`foo.component.spec.js`), and a routing file (`foo.routes.js`).

Since we're using Webpack, We'll need to import our component somewhere. Since this is a generic app route (and for simplicity), we'll import it in `app.js`, under our root Angular module, like so:

`client/app/app.js`
```js
...
import FooModule from './foo/foo.component';
angular.module('aftestApp', [
  ...
  main,
  FooModule,
])
  .config(routeConfig)
  .run(...);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['aftestApp'], {
      strictDi: true
    });
  });
```

Now that we've imported our new Angular module and added it to the dependency list of our root Angular module, we should be able to navigate to `http://localhost:3000/foo` and see our new route:

<img src="../images/foo-route.jpg" alt="Foo route screenshot">

It's not a very impressive page right now, but it works.

Now, our user's aren't going to know to go to the `/foo` route. Let's add a navbar entry for it.

`client/components/navbar/navbar.component.js`
```js
import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  }, {
    title: 'Foo',
    state: 'foo'
  }];
  isCollapsed = true;

  constructor(Auth) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
```

Easy enough. Now we should see our entry for 'Foo' in our navbar. It should also be highlighted if you're still on the '/foo' route.

<img src="../images/foo-route-navbar.jpg" alt="Foo route screenshot">

You can read about all the other subgenerators that are available in the [Generators](../Generators) section of the docs.
