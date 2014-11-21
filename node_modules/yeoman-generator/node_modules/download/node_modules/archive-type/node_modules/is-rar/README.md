# is-rar [![Build Status](https://travis-ci.org/kevva/is-rar.svg?branch=master)](https://travis-ci.org/kevva/is-rar)

> Check if a Buffer/Uint8Array is a RAR file

## Install

```sh
$ npm install --save is-rar
```

## Usage

```js
var isRar = require('is-rar');
var read = require('fs').readFileSync;

isRar(read('foo.rar'));
// => true
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Kevin Mårtensson](https://github.com/kevva)
