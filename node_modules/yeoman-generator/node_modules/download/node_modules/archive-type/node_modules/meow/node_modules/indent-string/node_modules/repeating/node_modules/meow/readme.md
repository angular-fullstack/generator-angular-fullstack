# meow [![Build Status](https://travis-ci.org/sindresorhus/meow.svg?branch=master)](https://travis-ci.org/sindresorhus/meow)

> CLI app helper

![](https://cloud.githubusercontent.com/assets/170270/4606307/37c6f73c-5218-11e4-8624-e4008e952859.gif)


## Features

- Parses arguments using [minimist](https://github.com/substack/minimist)
- Converts flags to [camelCase](https://github.com/sindresorhus/camelcase)
- Outputs version when `--version`
- Outputs description and supplied help text when `--help`
- Outputs the above when no input is supplied *[(can be disabled)](#requireinput)*


## Install

```sh
$ npm install --save meow
```


## Usage

```sh
$ ./foo-app.js unicorns --rainbow-cake
```

```js
#!/usr/bin/env node
'use strict';
var meow = require('meow');
var fooApp = require('./');

var cli = meow({
	help: [
		'Usage',
		'  foo-app <input>'
	].join('\n')
});
/*
{
	input: ['unicorns'],
	flags: {rainbowCake: true},
	pkg: {
		name: 'foo-app',
		...
}
*/

fooApp(cli.input[0], cli.flags);
```


## API

### meow(options, minimistOptions)

Returns an object with:

- `input` *(array)* - Non-flag arguments
- `flags` *(object)* - Flags converted to camelCase
- `pkg` *(object)* - The `package.json` object

#### options

##### help

Type: `string`  

The help text you want shown.

##### pkg

Type: `string`  
Default: `package.json`

Relative path to `package.json`.

##### requireInput

Type: `boolean`  
Default: `true`

Require there to be at least one input argument.

##### argv

Type: `array`  
Default: `process.argv.slice(2)`

Custom arguments object.

#### minimistOptions

Type: `object`  
Default: `{}`

Minimist [options](https://github.com/substack/minimist#var-argv--parseargsargs-opts).


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
