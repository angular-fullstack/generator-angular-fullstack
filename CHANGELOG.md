<a name="v1.2.6"></a>
### v1.2.6 (2014-02-14)


#### Bug Fixes

* **app:**
  * redirect to login only on 401s ([64b7bace](http://github.com/DaftMonk/generator-angular-fullstack/commit/64b7bacea98e59cb72a44627b57ca331d9bf051d))
  * fixed incorrect css path for usemin in gruntfile ([46fca240](http://github.com/DaftMonk/generator-angular-fullstack/commit/46fca240009d2c61aa07b5cef2275e4095033a10))
* **grunt:** include partial sub-directories in htmlmin ([77564ba3](http://github.com/DaftMonk/generator-angular-fullstack/commit/77564ba3b59baa52546f3b1170ee9cad16b7d413))
* **server:**
  * fixed connect-mongo error ([c12db5b3](http://github.com/DaftMonk/generator-angular-fullstack/commit/c12db5b3e9b7475ba4581f23f9c20e4ce701b855))
  * livereload now waits for server to finish restarting ([71d63f0a](http://github.com/DaftMonk/generator-angular-fullstack/commit/71d63f0a704a2773cee368b1af24c188e04d0ae3))
  * exposed configured passport from passport module ([772133de](http://github.com/DaftMonk/generator-angular-fullstack/commit/772133de1f86c8a6a8c93179673deb4359e30c94))
  * only require models if they are coffescript or js files ([ce2ee236](http://github.com/DaftMonk/generator-angular-fullstack/commit/ce2ee2369ff0c4aedc1a13d04359d918ea1b3d8d))


#### Features

* **deps:** upgrade angular to 1.2.11, and jquery to 1.11.0 ([cd5c3030](http://github.com/DaftMonk/generator-angular-fullstack/commit/cd5c303023f57de423ca69067b1105db17d066e3))
* **app:** switched sass-bootstrap to offical bootstrap-sass ([024fee88](http://github.com/DaftMonk/generator-angular-fullstack/commit/024fee8831c4a32962283878b6b9dbd444874ec0))

<a name="v1.2.5"></a>
### v1.2.5 (2014-01-27)


#### Bug Fixes

* **app:**
  * fixed coffee service so it's min-safe ([c18c9da4](http://github.com/DaftMonk/generator-angular-fullstack/commit/c18c9da4475e8e48507746f441186edf9fde18b1))
  * fixed bootstrap css being imported rather than compass bootstrap ([f2739987](http://github.com/DaftMonk/generator-angular-fullstack/commit/f27399879e84daf7230d9cd953c19e93bcd22746))
* **server:** 
  * replaced deprecated bodyparser ([788fda04](http://github.com/DaftMonk/generator-angular-fullstack/commit/788fda04ebd1ed7d24190aacda44c252fd1ae002))  
  * updated node version dependency ([b19a0997](http://github.com/DaftMonk/generator-angular-fullstack/commit/b19a0997c6db08a47a56069621756129e07c5915))   
* **gen:** updated generator dependencies ([115008d3](http://github.com/DaftMonk/generator-angular-fullstack/commit/115008d378a9fd9cc47561f451cd9153f4f2c566)) 

<a name="v1.2.4"></a>
### v1.2.4 (2014-01-16)


#### Bug Fixes

* **grunt:** fixed incorrect templating expression ([2a59e070](http://github.com/DaftMonk/generator-angular-fullstack/commit/2a59e070bb89abb4ea83e165f8a29b8de94621f1))

<a name="v1.2.3"></a>
### v1.2.3 (2014-01-16)


#### Bug Fixes

* **app:** fixed jshint warning in user model ([f668fdc7](http://github.com/DaftMonk/generator-angular-fullstack/commit/f668fdc7f798e2656a9576f249836f7c91d27f1a))

<a name="v1.2.2"></a>
### v1.2.2 (2014-01-16)


#### Bug Fixes

* **app:**
  * replaced bcrypt with crypto for windows users ([af20c3ab](http://github.com/DaftMonk/generator-angular-fullstack/commit/af20c3ab6fd63e41475175e333810d09b3e9c3ea))
  * added karma dependencies directly to package template ([13ea60e7](http://github.com/DaftMonk/generator-angular-fullstack/commit/13ea60e7ec5763fb7f96900464df1bf26ee6912c))

<a name="v1.2.1"></a>
### v1.2.1 (2014-01-12)

<a name="v1.2.0"></a>
## v1.2.0 (2014-01-11)

#### Features

* **app:**
  * restructured project for easier configuration ([0a2bf2ab](http://github.com/DaftMonk/generator-angular-fullstack/commit/0a2bf2abe04de834c786402b8945d247b4f951aa))
  * grunt build now moves all files into dist folder ([e6eff5d5](http://github.com/DaftMonk/generator-angular-fullstack/commit/e6eff5d56bf2a784feb3de6218e74b5390df319f))
* **server:** added jshint error checking before livereload occurs ([7e001d31](http://github.com/DaftMonk/generator-angular-fullstack/commit/7e001d3156d778022e7b6847cc65934432fb9200))
* **gen:** added passport question for scaffolding out user account creation ([87841064](http://github.com/DaftMonk/generator-angular-fullstack/commit/8784106409e51cddf8fcdc6ab52b1e81137cda19))
   
#### Bug Fixes

* **app:** removed async dependency ([d5636d71](http://github.com/DaftMonk/generator-angular-fullstack/commit/d5636d712a984948fb92b82794681c07d43d830d))
* **gitignore:** fix app/views being ignored by git ([7fa82ff9](http://github.com/DaftMonk/generator-angular-fullstack/commit/7fa82ff953e9f1368b8f9d6c3dadb5fe83bec002))
* **server:**
  * config wasn't added to default project ([79c5e027](http://github.com/DaftMonk/generator-angular-fullstack/commit/79c5e027719507a74497c2f6be77375a513316c4))
  * removed typo and cleaned up extra whitespace ([1a132c28](http://github.com/DaftMonk/generator-angular-fullstack/commit/1a132c2822fd4973068b8beae075d0c8ec3efd42))
  * fixed style issues that were tripping up jshint

#### Breaking Changes

* `grunt heroku` is deprecated. Use `grunt build` instead.

<a name="v1.1.1"></a>
### v1.1.1 (2013-12-25)

#### Bug Fixes 

* **views:**
  * Replaced deprecated jade tags.

#### Features

* **app:**
  * Updgrade to AngularJS 1.2.6

<a name="v1.1.0"></a>
## v1.1.0 (2013-12-22)


#### Bug Fixes

* **app:**
  * only copy CSS if Compass is not installed ([7e586745](http://github.com/DaftMonk/generator-angular-fullstack/commit/7e58674585e138c0f2eb81f46ef2cc4f1b9a3bf8))
  * services use classified names ([56a71a83](http://github.com/DaftMonk/generator-angular-fullstack/commit/56a71a83cdf90f81bb37b422ba4d40e75d28e1fe), closes [#484](http://github.com/DaftMonk/generator-angular-fullstack/issues/484))
  * reload JS files in watch ([d20f5bd2](http://github.com/DaftMonk/generator-angular-fullstack/commit/d20f5bd20ba95d47447f8acceee491a0a0ba9724))
* **build:** deselecting ngRoute does remove route stuff ([a358c1ae](http://github.com/DaftMonk/generator-angular-fullstack/commit/a358c1ae69bff6a7708ea0a77248698f931f2e4d), closes [#486](http://github.com/DaftMonk/generator-angular-fullstack/issues/486))
* **gen:**
  * updated all conflicts, and fixed some bugs, from merging with upstream ([d07c829d](http://github.com/DaftMonk/generator-angular-fullstack/commit/d07c829db283eaa4986774f9664243b50b3b5171))
  * fix bower install prompt during project gen ([706f1336](http://github.com/DaftMonk/generator-angular-fullstack/commit/706f1336852923e409d669ae6fc6faeda7bbb017), closes [#505](http://github.com/DaftMonk/generator-angular-fullstack/issues/505))
* **package:** fix imagemin for windows users ([b3cec228](http://github.com/DaftMonk/generator-angular-fullstack/commit/b3cec228b4354343929ca07fd7225526cdab74d9))
* **views:**
  * fix ng includes ([598c69a5](http://github.com/DaftMonk/generator-angular-fullstack/commit/598c69a594e00f598e0cbd435444bc8abaa0d4ee))
  * add compiled views to gitignore ([087ede5f](http://github.com/DaftMonk/generator-angular-fullstack/commit/087ede5f8e2cef4c49f940ef922d71a51d110d51))
  * fix incorrect build path for vendor css ([0ed2a200](http://github.com/DaftMonk/generator-angular-fullstack/commit/0ed2a20018086fa514846ad2503841f6d5b23e16))


#### Features

* **app:**
  * add jasmine browser global to test jshintrc ([11b6ed42](http://github.com/DaftMonk/generator-angular-fullstack/commit/11b6ed42b5e941f25cc305eb5c4e8ba49586cf64))
  * use lowercase file names ([23e5d772](http://github.com/DaftMonk/generator-angular-fullstack/commit/23e5d7724e7e02e4b974f4e804f35eca33a53aea), closes [#463](http://github.com/DaftMonk/generator-angular-fullstack/issues/463))
  * use htmlmin for smaller HTML files ([2b85a52a](http://github.com/DaftMonk/generator-angular-fullstack/commit/2b85a52a054ac8cf1ab86ce1cd3de7819d30ea52), closes [#469](http://github.com/DaftMonk/generator-angular-fullstack/issues/469))
  * use grunt-bower-install for dep management ([ba7b5051](http://github.com/DaftMonk/generator-angular-fullstack/commit/ba7b505117307059a6d013d838c8aeff6db0e452), closes [#497](http://github.com/DaftMonk/generator-angular-fullstack/issues/497))
  * Enable Node debug mode ([83ae4a9e](http://github.com/DaftMonk/generator-angular-fullstack/commit/83ae4a9e328a388dd61414634ca5e10c8a0c819b))
* **gen:**
  * Added navbar to starting template ([b5e94749](http://github.com/DaftMonk/generator-angular-fullstack/commit/b5e94749384ab9a3305991df62d7ed9856bded83))
  * additional work for compass support ([11cb9943](http://github.com/DaftMonk/generator-angular-fullstack/commit/11cb99437271b6e8f6cdaee8fd5fc9cda7a20d1d))
  * add Compass support to the initialization process ([7fac1194](http://github.com/DaftMonk/generator-angular-fullstack/commit/7fac1194179df3181f52258b0aa7333799fec253))
  * add welcome message and dep notice for minsafe ([f0bb8da2](http://github.com/DaftMonk/generator-angular-fullstack/commit/f0bb8da2d67c3f627bf775e2d4f53340b5c980c4), closes [#452](http://github.com/DaftMonk/generator-angular-fullstack/issues/452))
* **server:** 
  * Added middleware for development mode that disables caching of script files ([c082c81c](http://github.com/DaftMonk/generator-angular-fullstack/commit/c082c81c21a9d8d6fd9fccd5001270759fb2a30f))
  * Moved express configuration code out of server.js and into config folder to make it a more high level bootstrap.


#### Breaking Changes

* Deselecting ngRoute adds controller and
ng-include to index.html
 ([a358c1ae](http://github.com/DaftMonk/generator-angular-fullstack/commit/a358c1ae69bff6a7708ea0a77248698f931f2e4d))
* `--minsafe` flag is now deprecated. 
* `grunt server` is now deprecated. Use `grunt serve` instead

<a name="v1.0.1"></a>
### v1.0.1 (2013-11-27)


#### Bug Fixes

* **coffee:** updated coffescript templates to point to partials ([f98e84ef](http://github.com/DaftMonk/generator-angular-fullstack/commit/f98e84efdd88243cff1ea449dc3a8e9dbebb7ccc))

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