### Heroku

#### Setup
You need a [Heroku](www.heroku.com) account and have the [Heroku Toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) installed. 

Create an app on Heroku and give it a name (e.g. myapp) :
```
heroku apps:create myapp
```
You can also use Heroku dashboard to create an app. 

If you're using mongoDB you will need to add a database to your app (e.g. [mlab](https://mlab.com/) or [compose](https://www.compose.com/mongodb)): 
Here we use mlab:
```
heroku addons:create mongolab
```

Now, build your app by running: 
```
gulp build
```
This creates a folder called `dist`. 

Now go to `dist` and set it up as a git repository:
```
git init 
```

Add Heroku's app as your `dist` folder's remote repository:
```
heroku git:remote -a myapp
```

It is time to push your local repository to Heroku. From your app's root run:
```
gulp buildcontrol:heroku
```

Your app should be live now. To view your app run:
```
heroku open
```

Note on MongoDB setup: if you get an `Error: No valid replicaset instance servers found`  you need to modify moongose connection options in config/environment/production.js as follows:  
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

#### Pushing Updates

```
gulp build
```

Commit and push the resulting build, located in your dist folder:
```
gulp buildcontrol:heroku
```
