# decompress-unzip [![Build Status](https://travis-ci.org/kevva/decompress-unzip.svg?branch=master)](https://travis-ci.org/kevva/decompress-unzip)

> zip decompress plugin

## Install

```bash
$ npm install --save decompress-unzip
```

## Usage

```js
var Decompress = require('decompress');
var zip = require('decompress-unzip');

var decompress = new Decompress()
    .src('foo.zip')
    .dest('destFolder')
    .use(zip({ strip: 1 }));

decompress.decompress();
```

## Options

### strip

Type: `Number`  
Default: `0`

Equivalent to `--strip-components` for tar.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
