# decompress-tarbz2 [![Build Status](https://travis-ci.org/kevva/decompress-tarbz2.svg?branch=master)](https://travis-ci.org/kevva/decompress-tarbz2)

> tar.bz2 decompress plugin

## Install

```sh
$ npm install --save decompress-tarbz2
```

## Usage

```js
var Decompress = require('decompress');
var tarbz2 = require('decompress-tarbz2');

var decompress = new Decompress()
    .src('foo.tar.bz2')
    .dest('destFolder')
    .use(tarbz2({ strip: 1 }));

decompress.decompress();
```

## Options

### strip

Type: `Number`  
Default: `0`

Equivalent to `--strip-components` for tar.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
