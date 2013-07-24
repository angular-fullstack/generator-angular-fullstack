<a name="v0.3.1"></a>
## v0.3.1 (2013-07-24)


#### Bug Fixes

* **app:**
  * order of script inclusions ([9919b2d0](http://github.com/yeoman/generator-angular/commit/9919b2d0bb749cbe5e795608c2b93c3504e3298b), closes [#278](http://github.com/yeoman/generator-angular/issues/278))
  * copy glyphicons for sass ([2c458009](http://github.com/yeoman/generator-angular/commit/2c4580096572678de6212c8592fb553c10b3a4c0), closes [#269](http://github.com/yeoman/generator-angular/issues/269))
  * add jQuery <script> into index.html template ([3766b4ff](http://github.com/yeoman/generator-angular/commit/3766b4ffe1b91a647a34577ae529d11c994e3a1d))
* **docs:**
  * fix section explaining generating services ([8b4787c6](http://github.com/yeoman/generator-angular/commit/8b4787c649b918cb2baf78369e86c86156bca2ec))
  * Add explicit instructions for installing yo ([8404c068](http://github.com/yeoman/generator-angular/commit/8404c0687ab582e15b1f46f96da4f7812d641912))


#### Features

* **app:**
  * generate Travis config ([38a4ce9b](http://github.com/yeoman/generator-angular/commit/38a4ce9baa207c49c79b2f3128c2c3637164c011))
  * use checkboxes for module selection ([65fe9d25](http://github.com/yeoman/generator-angular/commit/65fe9d25fdc1f9fa9c24c4858915c2b63b4531cb))
  * add jshintrc for testing folder ([8727288b](http://github.com/yeoman/generator-angular/commit/8727288bcefdb255f3c24cf80ab1c7868b86d044))
* **build:** add support for svg optimization ([03d63c69](http://github.com/yeoman/generator-angular/commit/03d63c69e8006e563baee0cc4a4ba459e7c13ccd))

# 0.3.0 (2013-06-26)

## Features
### decorator

* Add decorator template files ([c9f80b3d](http://github.com/yeoman/generator-angular/commit/c9f80b3d))

* Define creation of decorator at decorator/index.js and added USAGE File ([4c53c1ad](http://github.com/yeoman/generator-angular/commit/4c53c1ad))

* Add prompt if file already exists ([7d9b862c](http://github.com/yeoman/generator-angular/commit/7d9b862c))

### build

* Replace regard with contrib-watch ([edf00565](http://github.com/yeoman/generator-angular/commit/edf00565))



## Bug fixes
### build

* bad concatenation of main.css ([4c7e4b29](http://github.com/yeoman/generator-angular/commit/4c7e4b29))

* Bumped yeoman-generator version for new prompt ([9e899bb2](http://github.com/yeoman/generator-angular/commit/9e899bb2))

* don't override generated css files ([dd6a0cb1](http://github.com/yeoman/generator-angular/commit/dd6a0cb1))

* use Usemin for all CSS. ([e6c2fa52](http://github.com/yeoman/generator-angular/commit/e6c2fa52))

* dropped nospawn option from watch ([02f61f82](http://github.com/yeoman/generator-angular/commit/02f61f82))

* add svg files to the copy task ([4b897ac8](http://github.com/yeoman/generator-angular/commit/4b897ac8))

* updated generated dependencies ([cab7c423](http://github.com/yeoman/generator-angular/commit/cab7c423))

* add httpFontsPath to Gruntfile ([b00deb1a](http://github.com/yeoman/generator-angular/commit/b00deb1a))

* coffeescript build was empty ([54edc9de](http://github.com/yeoman/generator-angular/commit/54edc9de))

* add compass task only if compass-flavored bootstrap is selected ([4408413e](http://github.com/yeoman/generator-angular/commit/4408413e))

### app

* Bootstrap Compass no prompt on Bootstrap no ([e73ffc49](http://github.com/yeoman/generator-angular/commit/e73ffc49))

* Use boolean prompts ([da89e70d](http://github.com/yeoman/generator-angular/commit/da89e70d))

* components to bower_components ([01cee4ba](http://github.com/yeoman/generator-angular/commit/01cee4ba))

### coffee

* syntax for minsafe directives ([62677ec0](http://github.com/yeoman/generator-angular/commit/62677ec0))

### decorator

* removed second dot in warning message ([6a89f8e5](http://github.com/yeoman/generator-angular/commit/6a89f8e5))

* use [] instead of new Array() to initialize prompts (jsHint) ([360222a6](http://github.com/yeoman/generator-angular/commit/360222a6))

### test

* Updated tests for new prompt ([64e57571](http://github.com/yeoman/generator-angular/commit/64e57571))

### cli

* fix typo in angular:constant generator usage ([6cbb80fd](http://github.com/yeoman/generator-angular/commit/6cbb80fd))




# 0.2.2 (2013-04-20)

## Features
### build

* Integrate grunt-rev into build process (87bab71)

### app

* automatically install dependencies (9f95630)

* add coffee option to Karma generator (e81b624)

### misc

* add Grunt support to automate releases and changelogs (9daa50a)



## Bug fixes
### build

* remove all files except git related on clean (21a0f43)

* fix Bower error caused by incorrect templates. (0ab5448)

* Moved duplicate grunt options into own section (3869ca8)

* grunt-bower-hooks was renamed (3bbaacd)

* Watch SVG files. Fixes generator-webapp#41 (45fe8ab)

* display correct message when running npm/bower (3498aa1)

* add Bootstrap reference when not using Compass (d123897)

* add SVG files to Grunt rev task. (3c8daab)

* Changed to shallow copy fonts (1f6b864)

* Ignore test subfolder (a07627b)

* finify bootstrap img (263ce61)

### coffee

* Fix compiling coffeescript files (71daa7f)

* fix loading coffeescript tests (9692a21)

* fix coffeescript directive test (aa2a9c0)

* rewrite app.coffee file when called with --coffee (0f5256d)

### app

* Remove `process.cwd()` from CS detection (3a707f4)

* use this.env.options.appPath (404c752)

* use `installDependencies()` method (8369d9a)

* invoke karma:app with `skip-install` option if defined (7e47dc2)

* tag closing inconsistency (ref #177) (51bd8d8)

### test

* Use $scope in tests instead of {} (58603bd)

* add Node 0.10 to travis file (60b1ea7)

### gen

* Fix controller spec generation (3bb58eb)

* remove trailing comma in gruntfile. (32afa5a)

### readme

* add note to readme about making a node_modules dir until global generators are supported (73a2450)

* add a note about running commands from the root app folder (f986c77)

* switched to global generators (18ef336)

* add note to readme about commit message conventions (d125dd2)

* Improve readme (8262b93)

* added documentation of route adding (7c5e03c)

* Corrected file extension in example (a1149ea)

### tests

* skip install on tests (5035d94)


# 0.2.1 (2013-04-07)

## Features
### build

* Integrate grunt-rev into build process (87bab71)

### app

* automatically install dependencies (9f95630)

### misc

* add Grunt support to automate releases and changelogs (9daa50a)



## Bug fixes
### build

* remove all files except git related on clean (21a0f43)

* fix Bower error caused by incorrect templates. (0ab5448)

* Moved duplicate grunt options into own section (3869ca8)

* grunt-bower-hooks was renamed (3bbaacd)

* Watch SVG files. Fixes generator-webapp#41 (45fe8ab)

### coffee

* Fix compiling coffeescript files (71daa7f)

* fix loading coffeescript tests (9692a21)

* fix coffeescript directive test (aa2a9c0)

* rewrite app.coffee file when called with --coffee (0f5256d)

### app

* Remove `process.cwd()` from CS detection (3a707f4)

### test

* Use $scope in tests instead of {} (58603bd)

### gen

* Fix controller spec generation (3bb58eb)

### readme

* add note to readme about making a node_modules dir until global generators are supported (73a2450)

* add a note about running commands from the root app folder (f986c77)


