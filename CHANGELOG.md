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


