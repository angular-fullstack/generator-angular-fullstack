---
title: Starting Up
sort: 0
---

# Starting your app

Now that you've gone through everything in the Getting Started section, lets get our app up and running. We do this by
running the following:

```bash
$ npm run start:server
```
and
```bash
$ npm run start:client
```

We should see something like this spit out after it:

```bash
$ npm run start:server

> myapp@0.0.0 start:server ~/myapp
> node server

finished populating things
finished populating users
Express server listening on 9000, in development mode
```

```bash
$ npm run start:client

> myapp@0.0.0 start:client ~/myapp
> webpack-dev-server --config webpack.dev.js

i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from ./client/
i ｢wds｣: 404s will fallback to app.html

[at-loader] Using typescript@2.9.2 from typescript and "tsconfig.json" from ~/myapp/tsconfig.json.


[at-loader] Checking started in a separate process...

[at-loader] Ok, 0.267 sec.
‼ ｢wdm｣: Hash: 086b125c69250600bc89
Version: webpack 4.12.0
Time: 23788ms
Built at: 2018-06-16 23:52:27
                  Asset      Size     Chunks             Chunk Names
          app.bundle.js  6.07 MiB        app  [emitted]  app
    polyfills.bundle.js   481 KiB  polyfills  [emitted]  polyfills
       vendor.bundle.js   880 KiB     vendor  [emitted]  vendor
      app.bundle.js.map  6.24 MiB        app  [emitted]  app
polyfills.bundle.js.map   551 KiB  polyfills  [emitted]  polyfills
   vendor.bundle.js.map  1.03 MiB     vendor  [emitted]  vendor
     ../client/app.html  1.31 KiB             [emitted]
Entrypoint app = app.bundle.js app.bundle.js.map
Entrypoint polyfills = polyfills.bundle.js polyfills.bundle.js.map
Entrypoint vendor = vendor.bundle.js vendor.bundle.js.map

WARNING in ./node_modules/@angular/core/fesm5/core.js 4826:15-36
System.import() is deprecated and will be removed soon. Use import() instead.
For more info visit https://webpack.js.org/guides/code-splitting/
 @ ./client/app/app.ts 3:0-47
 @ multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./client/app/app.ts

WARNING in ./node_modules/@angular/core/fesm5/core.js 4838:15-102
System.import() is deprecated and will be removed soon. Use import() instead.
For more info visit https://webpack.js.org/guides/code-splitting/
 @ ./client/app/app.ts 3:0-47
 @ multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./client/app/app.ts
Child html-webpack-plugin for "..\client\app.html":
                 Asset      Size  Chunks  Chunk Names
    ../client/app.html  28.5 KiB       0
    Entrypoint undefined = ../client/app.html
i ｢wdm｣: Compiled with warnings.
```

(The warnings are from Angular. See [#21560](https://github.com/angular/angular/issues/21560))

And then our default browser should open up to the app:

<img src="../assets/afs-screenshot.png" alt="App Screenshot">

Fantastic! We're now up and running with our Full-Stack Angular web application! So what can it do?

### Homepage

Assuming you scaffolded with a back-end database, you should see some 'features'. If you scaffolded with socket.io, you
should see 'x' buttons next to each, and an input box. Try opening two browser windows to the same page side-by-side,
and hitting the 'x' on one of the features. You should see the feature get removed on both web pages. Neat! This is
because these database object changes are communicated to clients using socket.io.


<img src="../assets/socket.io-demo.gif" alt="Socket.io demo screenshot">


Neat. Let's see what else we can do.

### Auth

Assuming you scaffolded with auth support, you should see a 'Sign Up' and a 'Log In' button at the top-right of your
page. Let's go to the Log In page.

You should see inputs for an email address and a password. When running your project in a development environment,
you'll get two user accounts automatically generated:

 * Test User
   * email: test@example.com
   * password: test
   * role: user
 * Admin
   * email: admin@example.com
   * password: admin
   * role: admin

Go ahead and log in with the admin account, so we can see the extra admin bits too. You should then get sent back to the
home page, but should notice that the navbar looks a bit different:

<img src="../assets/logged-in.jpg" alt="Logged in as admin screenshot">


First, at the top right, we see a greeting for our username, a cog icon (for user settings), and a logout button. Then,
since we're an admin, we see a new 'Admin' state on the navbar. The admin section lists users and allows you to delete
them. The user settings page allows you to change your password.

[Next: Adding a Route](01_Adding_a_Route)
