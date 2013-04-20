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


