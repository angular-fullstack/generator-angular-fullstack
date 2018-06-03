---
title: Route
sort: 2
---

### Route
Generates a new route.

Example:
```bash
yo angular-fullstack:route myroute
[?] Where would you like to create this route? client/app/
[?] What will the url of your route be? /myroute
```

Produces:

    client/app/myroute/myroute.component.js
    client/app/myroute/myroute.component.spec.js
    client/app/myroute/myroute.html
    client/app/myroute/myroute.module.js

The generator will also add the new route's `NgModule` to the imports of your main `AppModule`. You may want to move this import to a sub-module.
