### Heroku

Deploying to heroku only takes a few steps.

```
yo angular-fullstack:heroku
```

To work with your new heroku app using the command line, you will need to run any `heroku` commands from the `dist` folder.


If you're using mongoDB you will need to add a database to your app:

```
heroku addons:create mongolab
```

Note: if you get an `Error: No valid replicaset instance servers found`  you need to modify moongose connection options in config/environment/production.js as follows:  
```
options: {
  db: {
    safe: true,
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
  }
}
```
One of the odd things about the Node driver is that the default timeout for replica set connections is only 1 second, so make sure you're setting it to something more like 30s like in this example.


Your app should now be live. To view it run `heroku open`.

>
> If you're using any oAuth strategies, you must set environment variables for your selected oAuth. For example, if we're using **Facebook** oAuth we would do this :
>
> ```
> heroku config:set FACEBOOK_ID=id
> heroku config:set FACEBOOK_SECRET=secret
> ```
>
> You will also need to set `DOMAIN` environment variable:
>
> ```
> heroku config:set DOMAIN=<your-heroku-app-name>.herokuapp.com
> # or (if you're using it):
> heroku config:set DOMAIN=<your-custom-domain>
> ```
>

To make your deployment process easier consider using [grunt-build-control](https://github.com/robwierzbowski/grunt-build-control).

#### Pushing Updates

```
gulp build
```

Commit and push the resulting build, located in your dist folder:

```
gulp buildcontrol:heroku
```
