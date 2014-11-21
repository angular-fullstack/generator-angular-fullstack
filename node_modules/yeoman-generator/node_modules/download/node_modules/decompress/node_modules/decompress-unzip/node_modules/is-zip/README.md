# is-zip [![Build Status](https://travis-ci.org/kevva/is-zip.svg?branch=master)](https://travis-ci.org/kevva/is-zip)

> Check if a Buffer/Uint8Array is a ZIP file

## Install

```bash
$ npm install --save is-zip
```

```bash
$ component install kevva/is-zip
```

```bash
$ bower install --save is-zip
```

## Usage

```js
var fs = require('fs');
var isZip = require('is-zip');
var buf = fs.readFileSync('foo.zip');

isZip(buf);
// => true
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) © [Kevin Mårtensson](https://github.com/kevva)
