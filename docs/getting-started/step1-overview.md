# Project Overview

Now that you've got a Full-Stack Angular project scaffolded, lets go over how everything is structured.

The first thing you should notice at the root of where you ran the generator is a `README.md` file.
Go ahead and listen to the angry filename and read it, then come back here.

You should have everything you need installed now. Find the `package.json` file.
That file tells npm which dependencies to install, as well as a few other things about your app.

Now find the `gulpfile.babel.js`. Pretty much everthing you do with your app from now on will have something to do with this file.
[Gulp](http://gulpjs.com/) is a task runner that runs on top of Node. It automates tasks such as compiling code, copying files,
running different test commands, running your server, building your code for distribution, and on and on.
Let's go over some of the most important Gulp tasks:

* `gulp serve` - This will build the code for development use, run a dev server, and open up the application in your default browser.
* `gulp build` - This will build the code into the `dist/` folder, which you can then distribute to your production servers.
* `gulp test` - This will run client and server unit + integration tests.

## Webpack

Webpack is a module bundler for front-end web applications. Basically it takes all of your front-end files (JavaScript source + libs, CSS, HTML, etc) and bundles them all up into intelligently laid-out JavaScript bundles. It uses CommonJS to `import`/`export` modules/assets. The takeaway here is that instead of loading your JS files directly in the browser, instead you'll be loading the webpack bundles. Also, instead of everything naively using the global browser scope, you'll need to `import`/`export` anything you'd like to use. We'll look into this in greater detail later.
