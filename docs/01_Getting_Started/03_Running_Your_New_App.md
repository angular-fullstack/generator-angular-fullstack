## Running Your New App

You can start your new app by running `gulp serve`. This will do some preliminary things like clean out temporary
files, lint your scripts, inject any new CSS files into your main one, apply environment variables, and download
any new TypeScript definitions. It will then start up a new development server, which will kick off a Webpack build.
it uses Browser Sync to facilitate front-end development. Your files will also be watched for changes. Any front-end
changes will kick off another webpack build. Any back-end changes will restart the back-end server, cleaning the
development database and re-seeding it as well.

Once the `serve` tasks are complete, a browser tab should be opened to your new app server.
