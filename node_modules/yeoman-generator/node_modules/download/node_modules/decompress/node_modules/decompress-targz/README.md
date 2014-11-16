# decompress-targz [![Build Status](https://travis-ci.org/kevva/decompress-targz.svg?branch=master)](https://travis-ci.org/kevva/decompress-targz)

> tar.gz decompress plugin

## Install

```sh
$ npm install --save decompress-targz
```

## Usage

```js
var Decompress = require('decompress');
var targz = require('decompress-targz');

var decompress = new Decompress()
    .src('foo.tar.gz')
    .dest('destFolder')
    .use(targz({ strip: 1 }));

decompress.decompress();
```

## Options

### strip

Type: `Number`  
Default: `0`

Equivalent to `--strip-components` for tar.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
