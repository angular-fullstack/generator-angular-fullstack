# Adding a Route

Alright, now let's add another route to our app. We'll call it 'foo'. We can easily do this with the
`yo angular-fullstack:route` subgenerator command:

```bash
$ yo angular-fullstack:route foo

? Where would you like to create this route? client/app/
? What will the url of your route be? example
   create client\app\foo\foo.component.js
   create client\app\foo\foo.component.test.js
   create client\app\foo\foo.html
   create client\app\foo\foo.module.js
```

We give it our route name ('foo'), which folder to put the route under ('client/app/foo/'), and the URL of the route
('/foo').

This will create an Angular component (`foo.component.js`) with an Angular module (`foo.module.js`), a template file
(`foo.html`), a CSS file (`foo.scss`), and a unit test file (`foo.component.test.js`).

Since generator version 5.0.0, the generator should automatically import the new route's module into the root app
module.

Now we should be able to navigate to `http://localhost:8080/foo` and see our new route:

<img src="/assets/foo-route.jpg" alt="Foo route screenshot">

It's not a very impressive page right now, but it works.

Now, our user's aren't going to know to go to the `/foo` route. Let's add a navbar entry for it.

`client/components/navbar/navbar.component.js`
```js
//...

@Component({
    selector: 'navbar',
    template: require('./navbar.html'),
})
export class NavbarComponent {
    menu = [{
        title: 'Home',
        'link': '/home',
    }, {
        // Add here
        title: 'Foo',
        'link': '/foo',
    }];
    //...
}
```

Easy enough. Now we should see our entry for 'Foo' in our navbar. It should also be highlighted if you're still on the
'/foo' route.

<img src="/assets/foo-route-navbar.jpg" alt="Foo route screenshot">

<!--You can read about all the other subgenerators that are available in the [Generators](../Generators) section of the docs.-->
