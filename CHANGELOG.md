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