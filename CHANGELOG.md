<a name="v1.0.0"></a>
## v1.0.0 (2013-11-26)


#### Bug Fixes

* **build:**
  * use test-specifc jshintrc ([c00c091b](http://github.com/DaftMonk/generator-angular-fullstack/commit/c00c091bdca2b55685d81a2b84b002d73aacbdcc))
  * add webapp upstream features and better coffee ([c23acebb](http://github.com/DaftMonk/generator-angular-fullstack/commit/c23acebbd8fabd391bfeee0d424f26e59f756a03))
  * use grunt-newer for styles and jshint ([b1eeb68a](http://github.com/DaftMonk/generator-angular-fullstack/commit/b1eeb68a8290aee930887fc473034ee7f8e2ccc3))
  * standardize comments and comment out uglify:dist ([d5d3e458](http://github.com/DaftMonk/generator-angular-fullstack/commit/d5d3e458e70d054707c70d058454fdd3d94070fe), closes [#455](http://github.com/DaftMonk/generator-angular-fullstack/issues/455))
* **deps:** upgrade dependencies ([3a57216f](http://github.com/DaftMonk/generator-angular-fullstack/commit/3a57216ff9e3192db3804634f360253e9fcce69d))
* **gen:**
  * Fixed jshint errors that were breaking grunt task ([c6ae81c8](http://github.com/DaftMonk/generator-angular-fullstack/commit/c6ae81c8110ee59c9099740ea2f90b0d08b810d3))

#### Features

* **app:**
  * Separate client and server watchers ([0ff8ffb1](http://github.com/DaftMonk/generator-angular-fullstack/commit/0ff8ffb105a2eb1cd079fabafc5a6517d62e861d))
  * imagemin handles gifs ([9341eb9b](http://github.com/DaftMonk/generator-angular-fullstack/commit/9341eb9b710b95c95407dc54ed4af6aa4a496426))
* **gen:**
  * added support for jade templates ([24a13bfe](http://github.com/DaftMonk/generator-angular-fullstack/commit/24a13bfea0e4a9633f33e37df4a4710fecdea937))
  * Support for server rendering and Angular's HTML5 mode ([5ccdeb7a](http://github.com/DaftMonk/generator-angular-fullstack/commit/5ccdeb7a5543e35c000a54dfc15289004e406866), closes [#18](http://github.com/DaftMonk/generator-angular-fullstack/issues/18), [#17](http://github.com/DaftMonk/generator-angular-fullstack/issues/17))
  * add image file as example ([b161c298](http://github.com/DaftMonk/generator-angular-fullstack/commit/b161c2982d86df1bb3de44cd9fa8aee05fc66ff3))
* **build:**
  * compile only changed coffeescript files in watch task ([4196e379](http://github.com/DaftMonk/generator-angular-fullstack/commit/4196e37912993ae37812fa19d9378d8b8d2cc9da), closes [#425](http://github.com/DaftMonk/generator-angular-fullstack/issues/425))
  * deprecate server in favor of serve ([ef056319](http://github.com/DaftMonk/generator-angular-fullstack/commit/ef0563192a9e3fc834ae97e7ec68470bcfdf56eb))

#### Breaking Changes

* `angular-fullstack:route`
* `angular-fullstack:view`

Will now generate views and routes in the views/partials folder.

**For existing projects:**

For generating routes and views, install generator-angular and use     it's sub-generators. 

They are exactly the same as the generators that you have been using. Example usage: `yo angular:route helloworld`.

**For New projects:**

Continue to use angular-fullstack route and view sub-generators.

The reason for this change in folder structure was to support server page rendering.


Closes #18, #17
 ([5ccdeb7a](http://github.com/DaftMonk/generator-angular-fullstack/commit/5ccdeb7a5543e35c000a54dfc15289004e406866))

* `grunt server` is being deprecated
 ([ef056319](http://github.com/DaftMonk/generator-angular-fullstack/commit/ef0563192a9e3fc834ae97e7ec68470bcfdf56eb))

<a name="v0.2.0"></a>
## v0.2.0 (2013-11-13)


#### Bug Fixes

* **bootstrap:** some plugins have ordering dependencies ([3da4a130](http://github.com/DaftMonk/generator-angular-fullstack/commit/3da4a1301e0b744c7a6054fafff26fff16b6442b))
* **build:** only include sass if sass is selected ([597b8b5c](http://github.com/DaftMonk/generator-angular-fullstack/commit/597b8b5cfab77b78e7f6091140beda2eeee0ed54), closes [#449](http://github.com/DaftMonk/generator-angular-fullstack/issues/449))
* **css:** remove merge conflicts ([d558af35](http://github.com/DaftMonk/generator-angular-fullstack/commit/d558af351c8a531132ce064a461bc038e0710b25))
* **gen:**
  * script paths use forward slashes ([40aa61dc](http://github.com/DaftMonk/generator-angular-fullstack/commit/40aa61dcc1bf31918bea3d2ce9a84c93554aa64a), closes [#410](http://github.com/DaftMonk/generator-angular-fullstack/issues/410))
  * remove extra "App" from service spec files ([4053f11f](http://github.com/DaftMonk/generator-angular-fullstack/commit/4053f11f800280569f5b7396ad015f0a6bcc7b49))
  * options should have descriptions ([da001832](http://github.com/DaftMonk/generator-angular-fullstack/commit/da001832dbdb268b3bf38f359c72b40c401273e4))
* **styles:** update path to icon images ([8daad4f2](http://github.com/DaftMonk/generator-angular-fullstack/commit/8daad4f2de9dbde4fcc810527da7c9607e1db8d4))
* **template:** remove redundant closing tag ([d1e560e0](http://github.com/DaftMonk/generator-angular-fullstack/commit/d1e560e0675ecb70e6c4b59cf4de9df461434a31), closes [#441](http://github.com/DaftMonk/generator-angular-fullstack/issues/441))


#### Features

* **app:**
  * run unit tests when test scripts are changed ([94af0b51](http://github.com/DaftMonk/generator-angular-fullstack/commit/94af0b510982b05c5a1939966e96aeccce087500))
  * update to angular 1.2.0 ([77082c6b](http://github.com/DaftMonk/generator-angular-fullstack/commit/77082c6b8d1dda76579f1970a270dffc359f027f))
  * reload grunt server when gruntfile is updated ([50c6abb9](http://github.com/DaftMonk/generator-angular-fullstack/commit/50c6abb9cce09a149253ceb8496feca813a71136))
  * upgrade to Bootstrap 3.0.1 ([59f4b1ba](http://github.com/DaftMonk/generator-angular-fullstack/commit/59f4b1ba73842b758174ad44a7da60af4f4db63f))
* **gen:**
  * allow app names to have custom suffix ([09f0f7b3](http://github.com/DaftMonk/generator-angular-fullstack/commit/09f0f7b3a8c3264b7527bc9fed8c709becec99eb))


<a name="v0.1.0"></a>
## v0.1.0 (2013-11-12)

#### Features

* **gen:** include MongoDB as an option When selected, sets up database with Mongoose. Repl ([280cc84d](http://github.com/DaftMonk/generator-angular-fullstack/commit/280cc84d735c60b1c261540dceda34dd7f91c93c), closes [#2](http://github.com/DaftMonk/generator-angular-fullstack/issues/2))